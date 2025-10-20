import React, { useEffect, useMemo, useState } from 'react';
import { Button, Col, Container, Row, Spinner, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { getCollection, createBattle } from '../../helpers/api/battle';
import { getCharacters } from '../../helpers/api/character';

interface BattleItem {
  id?: string | number;
  title: string;
  startTime?: string | number | Date;
  type?: string;
  bettingType?: string;
  createdAt?: string | number | Date;
  updatedAt?: string | number | Date;
  [key: string]: any;
}

const Battle = () => {
  document.title = 'Admin Colosseum | Battle management';

  const [data, setData] = useState<BattleItem[]>([]);
  const [total, setTotal] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Create battle modal state
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);
  const [characters, setCharacters] = useState<any[]>([]);
  const [formTitle, setFormTitle] = useState<string>("");
  const [formStart, setFormStart] = useState<string>(""); // datetime-local value
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);
  const [winnerId, setWinnerId] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  // UI state for 2-line participant selection interface
  const [rowSelect1, setRowSelect1] = useState<string>("");
  const [rowSelect2, setRowSelect2] = useState<string>("");
  const [participant1Id, setParticipant1Id] = useState<string>("");
  const [participant2Id, setParticipant2Id] = useState<string>("");

  const totalPages = useMemo(() => {
    if (typeof total === 'number' && total > 0) return Math.max(1, Math.ceil(total / pageSize));
    return 1;
  }, [total, pageSize]);

  const formatDateTime = (value?: string | number | Date) => {
    if (!value) return '-';
    try {
      const d = new Date(value);
      if (isNaN(d.getTime())) return String(value);
      return d.toLocaleString();
    } catch (_) {
      return String(value);
    }
  };

  const fetchBattles = async (page: number, limit: number) => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await getCollection({ page, limit });

      let items: BattleItem[] = [];
      let totalCount: number | undefined = undefined;

      if (Array.isArray(res)) {
        items = res as BattleItem[];
      } else if (res && typeof res === 'object') {
        const maybeData = (res as any).data ?? res;
        if (Array.isArray(maybeData)) {
          items = maybeData as BattleItem[];
          totalCount = (res as any).total ?? undefined;
        } else if (maybeData && typeof maybeData === 'object') {
          items = (maybeData.items ?? maybeData.results ?? []) as BattleItem[];
          totalCount = maybeData.total ?? maybeData.count ?? (res as any).total ?? undefined;
        }
      }

      setData(items || []);
      setTotal(totalCount);
    } catch (e: any) {
      setError(typeof e === 'string' ? e : e?.message || 'Failed to load battles');
      setData([]);
      setTotal(undefined);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormTitle("");
    setFormStart("");
    setSelectedCharacterIds([]);
    setWinnerId("");
    setFormError(null);
    setRowSelect1("");
    setRowSelect2("");
    setParticipant1Id("");
    setParticipant2Id("");
  };

  const openCreateModal = async () => {
    setFormError(null);
    setIsCreateOpen(true);
    try {
      const list = await getCharacters();
      setCharacters(Array.isArray(list) ? list : []);
    } catch (e: any) {
      setFormError(typeof e === 'string' ? e : e?.message || 'Failed to load characters');
      setCharacters([]);
    }
  };

  const closeCreateModal = () => {
    setIsCreateOpen(false);
    resetForm();
  };

  const toggleCharacter = (id: string) => {
    setSelectedCharacterIds(prev => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter(x => x !== id) : [...prev, id];
      // if winner removed, clear winner
      if (!next.includes(winnerId)) setWinnerId("");
      return next;
    });
  };

  const getCharId = (c: any) => String(c?.id ?? c?.characterId ?? c?.uuid ?? "");
  const getCharLabel = (c: any) => c?.name || c?.title || getCharId(c);

  // Keep selectedCharacterIds in sync with the two participant slots
  useEffect(() => {
    const ids = [participant1Id, participant2Id].filter(Boolean) as string[];
    setSelectedCharacterIds(ids);
    if (winnerId && !ids.includes(winnerId)) {
      setWinnerId("");
    }
  }, [participant1Id, participant2Id]);

  const handleAddParticipant = (row: 1 | 2) => {
    setFormError(null);
    const chosen = row === 1 ? rowSelect1 : rowSelect2;
    if (!chosen) return;
    // prevent selecting the same character in both rows
    const other = row === 1 ? participant2Id : participant1Id;
    if (other && other === chosen) {
      setFormError('This character is already selected in the other row');
      return;
    }
    if (row === 1) {
      setParticipant1Id(chosen);
    } else {
      setParticipant2Id(chosen);
    }
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formTitle.trim()) {
      setFormError('Title is required');
      return;
    }
    if (!formStart) {
      setFormError('Start time is required');
      return;
    }
    if (selectedCharacterIds.length < 2) {
      setFormError('Please select at least two characters');
      return;
    }
    if (!winnerId) {
      setFormError('Please select a winner');
      return;
    }
    if (!selectedCharacterIds.includes(winnerId)) {
      setFormError('Selected winner must be among participants');
      return;
    }

    let isoStart: string;
    try {
      isoStart = new Date(formStart).toISOString();
    } catch (_) {
      setFormError('Invalid date');
      return;
    }

    const participations = selectedCharacterIds.map(cid => ({
      characterId: cid,
      isWinner: cid === winnerId,
    }));

    const payload = { title: formTitle.trim(), startTime: isoStart, participations };

    try {
      setCreating(true);
      await createBattle(payload as any);
      closeCreateModal();
      // refresh list
      fetchBattles(currentPage, pageSize);
    } catch (e: any) {
      setFormError(typeof e === 'string' ? e : e?.message || 'Failed to create battle');
    } finally {
      setCreating(false);
    }
  };
 
  useEffect(() => {
    fetchBattles(currentPage, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  const canGoPrev = currentPage > 1;
  const canGoNext = typeof totalPages === 'number' ? currentPage < totalPages : data.length === pageSize;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row className="mb-3">
            <Col xs={12} xl={12}>
              <h4 className="mb-0">Battles</h4>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="d-flex align-items-center justify-content-end gap-3 mb-3">
                <div>
                  <label htmlFor="pageSize" className="me-2">Rows per page</label>
                  <select
                    id="pageSize"
                    className="form-select d-inline-block w-auto"
                    value={pageSize}
                    onChange={(e) => {
                      setCurrentPage(1);
                      setPageSize(parseInt(e.target.value, 10));
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div>
                  <Button color="primary" onClick={openCreateModal}>Create battle</Button>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table align-middle table-striped">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Start Time</th>
                      <th>Type</th>
                      <th>Betting Type</th>
                      <th>Created At</th>
                      <th>Updated At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="text-center">
                          <Spinner size="sm" className="me-2" /> Loading battles...
                        </td>
                      </tr>
                    ) : data && data.length > 0 ? (
                      data.map((item, idx) => (
                        <tr key={item.id ?? idx}>
                          <td>{item.title ?? '-'}</td>
                          <td>{formatDateTime(item.startTime)}</td>
                          <td>{item.type ?? '-'}</td>
                          <td>{item.bettingType ?? '-'}</td>
                          <td>{formatDateTime(item.createdAt)}</td>
                          <td>{formatDateTime(item.updatedAt)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center text-muted">No battles found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="text-muted">
                  Page {currentPage}
                  {typeof total === 'number' ? ` of ${totalPages}` : ''}
                  {typeof total === 'number' ? ` • ${total} total` : ''}
                </div>
                <div className="btn-group" role="group" aria-label="Pagination">
                  <Button color="light" disabled={!canGoPrev || loading} onClick={() => setCurrentPage(1)}>
                    « First
                  </Button>
                  <Button color="light" disabled={!canGoPrev || loading} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                    ‹ Prev
                  </Button>
                  <Button color="light" disabled={!canGoNext || loading} onClick={() => setCurrentPage(p => p + 1)}>
                    Next ›
                  </Button>
                  <Button color="light" disabled={!canGoNext || loading} onClick={() => typeof totalPages === 'number' ? setCurrentPage(totalPages) : null}>
                    Last »
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>

        <Modal isOpen={isCreateOpen} toggle={closeCreateModal} size="lg">
          <ModalHeader toggle={closeCreateModal}>Create battle</ModalHeader>
          <Form onSubmit={handleSubmitCreate}>
            <ModalBody>
              {formError && (
                <div className="alert alert-danger" role="alert">{formError}</div>
              )}
              <Row className="g-3">
                <Col md={6}>
                  <FormGroup>
                    <Label for="battleTitle">Title</Label>
                    <Input
                      id="battleTitle"
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Enter title"
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="battleStart">Start time</Label>
                    <Input
                      id="battleStart"
                      type="datetime-local"
                      value={formStart}
                      onChange={(e) => setFormStart(e.target.value)}
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>

              <hr />
              {/* Label */}
              <Row className="g-3 align-items-end mb-2">
                <Col md={4}>
                  <Label>Characters</Label>
                </Col>
                <Col md={2}>
                </Col>
                <Col md={4}>
                  <Label>Participants</Label>
                </Col>
                <Col md={2}>
                  <Label>Winner</Label>
                </Col>
              </Row>
              {/* Ligne 1 */}
              <Row className="g-3 align-items-end mb-2">
                <Col md={4}>
                  <FormGroup>
                    <Input
                      id="row1-select"
                      type="select"
                      value={rowSelect1}
                      onChange={(e) => setRowSelect1(e.target.value)}
                    >
                      <option value="">-- Sélectionner --</option>
                      {characters.map((c: any) => {
                        const id = getCharId(c);
                        const label = getCharLabel(c);
                        return (
                          <option key={id} value={id}>{label}</option>
                        );
                      })}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup className="mb-2">
                    <Button
                      color="primary"
                      className="w-100"
                      type="button"
                      onClick={() => handleAddParticipant(1)}
                      disabled={!rowSelect1 || rowSelect1 === participant2Id}
                    >
                      Add
                    </Button>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-2">
                    <Input
                      type="text"
                      value={participant1Id ? getCharLabel(characters.find((c: any) => getCharId(c) === participant1Id)) : ''}
                      readOnly
                      placeholder="Aucun participant sélectionné"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <div className="form-check">
                      <Input
                        className="form-check-input"
                        type="radio"
                        id="winner1"
                        name="winner"
                        disabled={!participant1Id}
                        checked={winnerId === participant1Id}
                        onChange={() => setWinnerId(participant1Id)}
                      />
                    </div>
                  </FormGroup>
                </Col>
              </Row>

              {/* Ligne 2 */}
              <Row className="g-3 align-items-end">
                <Col md={4}>
                  <FormGroup>
                    <Input
                      id="row2-select"
                      type="select"
                      value={rowSelect2}
                      onChange={(e) => setRowSelect2(e.target.value)}
                    >
                      <option value="">-- Sélectionner --</option>
                      {characters.map((c: any) => {
                        const id = getCharId(c);
                        const label = getCharLabel(c);
                        return (
                          <option key={id} value={id}>{label}</option>
                        );
                      })}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup className="mb-2">
                    <Button
                      color="primary"
                      className="w-100"
                      type="button"
                      onClick={() => handleAddParticipant(2)}
                      disabled={!rowSelect2 || rowSelect2 === participant1Id}
                    >
                      Add
                    </Button>
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup className="mb-2">
                    <Input
                      type="text"
                      value={participant2Id ? getCharLabel(characters.find((c: any) => getCharId(c) === participant2Id)) : ''}
                      readOnly
                      placeholder="Aucun participant sélectionné"
                    />
                  </FormGroup>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <div className="form-check">
                      <Input
                        className="form-check-input"
                        type="radio"
                        id="winner2"
                        name="winner"
                        disabled={!participant2Id}
                        checked={winnerId === participant2Id}
                        onChange={() => setWinnerId(participant2Id)}
                      />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={closeCreateModal} disabled={creating}>Cancel</Button>
              <Button color="primary" type="submit" disabled={creating}>
                {creating ? (<><Spinner size="sm" className="me-2" /> Creating....</>) : 'Create'}
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default Battle;
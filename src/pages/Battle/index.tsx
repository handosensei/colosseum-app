import React, { useEffect, useMemo, useState } from 'react';
import { Button, Col, Container, Row, Spinner } from 'reactstrap';
import { getCollection } from '../../helpers/api/battle';

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

              <div className="d-flex align-items-center gap-2 mb-3">
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
      </div>
    </React.Fragment>
  );
};

export default Battle;
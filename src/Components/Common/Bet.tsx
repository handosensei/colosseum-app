import React from 'react';
import { Card, CardBody, CardFooter, Button, Spinner } from 'reactstrap';
import { getNext } from '../../helpers/api/battle';

interface ParticipationLike {
  character?: any;
  characterId?: string | number;
  name?: string;
  title?: string;
  [k: string]: any;
}

interface BattleLike {
  id?: string | number;
  title?: string;
  startTime?: string | number | Date;
  start?: string | number | Date;
  date?: string | number | Date;
  scheduledAt?: string | number | Date;
  status?: string;
  participations?: ParticipationLike[];
  participants?: ParticipationLike[];
  [k: string]: any;
}

const Bet = () => {
  const [battle, setBattle] = React.useState<BattleLike | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const formatDateTime = (value?: any) => {
    if (!value) return '-';
    try {
      const d = new Date(value);
      if (isNaN(d.getTime())) return String(value);
      return d.toLocaleString();
    } catch (_) {
      return String(value);
    }
  };

  const getCharLabel = (p?: ParticipationLike | null): string => {
    if (!p) return '';
    // Try nested character object first
    const c = (p as any).character || p;
    return c?.name || c?.title || String(c?.id ?? c?.characterId ?? '');
  };

  const extractParticipants = (b?: BattleLike | null): ParticipationLike[] => {
    if (!b) return [];
    const arr = (b.participations || b.participants || []) as ParticipationLike[];
    return Array.isArray(arr) ? arr : [];
  };

  const getBattleDate = (b?: BattleLike | null) => {
    if (!b) return undefined;
    return b.startTime ?? b.start ?? b.date ?? b.scheduledAt;
  };

  React.useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res: any = await getNext();
        // Some APIs wrap data
        const data = (res && (res.data ?? res.result ?? res.item)) || res;
        if (mounted) setBattle(data || null);
      } catch (e: any) {
        if (mounted) setError(typeof e === 'string' ? e : e?.message || 'Failed to load next battle');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  const participants = extractParticipants(battle);
  const p1 = participants[0];
  const p2 = participants[1];

  return (
    <React.Fragment>
      <Card>
        <div className="card-header align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">Battle Arena</h4>
          <div className="flex-shrink-0 text-end">
            <div className="text-muted small">
              {loading ? '...' : formatDateTime(getBattleDate(battle))}
            </div>
          </div>
        </div>
        <CardBody className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 260px)' }}>
          {loading && (
            <div className="text-center text-muted">
              <Spinner size="sm" className="me-2" /> Loading next battle...
            </div>
          )}
          {!loading && error && (
            <div className="text-center text-danger">{error}</div>
          )}
          {!loading && !error && (!p1 || !p2) && (
            <div className="text-center text-muted">No upcoming battle</div>
          )}
          {!loading && !error && p1 && p2 && (
            <div className="w-100" style={{ maxWidth: 420 }}>
              <Button color="primary" className="w-100 mb-3" disabled>
                {getCharLabel(p1) || 'Participant 1'}
              </Button>
              <div className="text-center fw-bold mb-3">VS</div>
              <Button color="danger" className="w-100" disabled>
                {getCharLabel(p2) || 'Participant 2'}
              </Button>
            </div>
          )}
        </CardBody>
        <CardFooter className="d-flex justify-content-between align-items-center">
          <div>
            status: {String((battle && (battle.status ?? battle?.state ?? '-')) || '-')}
          </div>
        </CardFooter>
      </Card>
    </React.Fragment>
  );
};

export default Bet;
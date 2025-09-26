  // ...existing code...


import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient";

const PHASES = ["Preparation", "Stockings", "Grow-out", "Harvest"];
function CroppingCyclesPage() {
  const [cycles, setCycles] = useState([]);
  const [phases, setPhases] = useState({}); // { cycleId: [phase, ...] }
  const [transactions, setTransactions] = useState({}); // { phaseId: [tx, ...] }
  const [newCycleName, setNewCycleName] = useState("");
  const [loading, setLoading] = useState(false);
  const [newTx, setNewTx] = useState({}); // { phaseId: { type, amount, description } }
  const [activePhase, setActivePhase] = useState({}); // { cycleId: phaseIndex }
  // Modal state and handlers
  const [showTxModal, setShowTxModal] = useState(false);
  const [modalPhaseId, setModalPhaseId] = useState(null);
  const [showCycleModal, setShowCycleModal] = useState(false);
  const openTxModal = (phaseId) => {
    setModalPhaseId(phaseId);
    setShowTxModal(true);
  };
  const closeTxModal = () => {
    setShowTxModal(false);
    setModalPhaseId(null);
  };
  const handleTxModalSubmit = (e) => {
    e.preventDefault();
    if (modalPhaseId) {
      addTransaction(modalPhaseId);
      closeTxModal();
    }
  };
  const openCycleModal = () => setShowCycleModal(true);
  const closeCycleModal = () => setShowCycleModal(false);
  const handleCycleModalSubmit = (e) => {
    e.preventDefault();
    addCycle();
    closeCycleModal();
  };

  useEffect(() => {
    fetchCycles();
  }, []);

  async function fetchCycles() {
    setLoading(true);
    const { data, error } = await supabase.from("cropping_cycles").select("*");
    if (error) console.error("Fetch error:", error);
    else {
      setCycles(data || []);
      // Fetch phases for each cycle
      if (data && data.length > 0) {
        const cycleIds = data.map(c => c.id);
        const { data: phaseData, error: phaseError } = await supabase.from("phases").select("*").in("cycle_id", cycleIds);
        if (phaseError) console.error("Phase fetch error:", phaseError);
        else {
          const phaseMap = {};
          const activeMap = {};
          phaseData.forEach(p => {
            if (!phaseMap[p.cycle_id]) phaseMap[p.cycle_id] = [];
            phaseMap[p.cycle_id].push(p);
          });
          // Set active phase to the first incomplete phase (or last if all complete)
          Object.keys(phaseMap).forEach(cycleId => {
            activeMap[cycleId] = 0;
          });
          setPhases(phaseMap);
          setActivePhase(activeMap);
          // Fetch transactions for all phases
          const phaseIds = phaseData.map(p => p.id);
          if (phaseIds.length > 0) {
            const { data: txData, error: txError } = await supabase.from("transactions").select("*").in("phase_id", phaseIds);
            if (txError) console.error("Tx fetch error:", txError);
            else {
              const txMap = {};
              txData.forEach(tx => {
                if (!txMap[tx.phase_id]) txMap[tx.phase_id] = [];
                txMap[tx.phase_id].push(tx);
              });
              setTransactions(txMap);
            }
          }
        }
      }
    }
    setLoading(false);
  }

  async function addCycle() {
    if (!newCycleName.trim()) return;
    const { data, error } = await supabase.from("cropping_cycles").insert([
      { name: newCycleName }
    ]).select();
    if (error) {
      console.error("Insert error:", error);
      return;
    }
    // Automatically add phases for the new cycle
    const cycleId = data[0].id;
    const phaseRows = PHASES.map(name => ({ cycle_id: cycleId, name }));
    const { error: phaseError } = await supabase.from("phases").insert(phaseRows);
    if (phaseError) console.error("Phase insert error:", phaseError);
    setNewCycleName("");
    fetchCycles();
  }

  async function deleteCycle(id) {
    // Delete phases and transactions for this cycle
    if (phases[id]) {
      const phaseIds = phases[id].map(p => p.id);
      if (phaseIds.length > 0) {
        await supabase.from("transactions").delete().in("phase_id", phaseIds);
        await supabase.from("phases").delete().in("id", phaseIds);
      }
    }
    const { error } = await supabase.from("cropping_cycles").delete().eq("id", id);
    if (error) console.error("Delete error:", error);
    fetchCycles();
  }

  async function addTransaction(phaseId) {
    const tx = newTx[phaseId];
    if (!tx || !tx.type || !tx.amount) return;
    const { error } = await supabase.from("transactions").insert([
      {
        phase_id: phaseId,
        type: tx.type,
        amount: Number(tx.amount),
        description: tx.description || ""
      }
    ]);
    if (error) console.error("Tx insert error:", error);
    setNewTx({ ...newTx, [phaseId]: { type: '', amount: '', description: '' } });
    fetchCycles();
  }

  function handleNextPhase(cycleId) {
    setActivePhase(prev => ({ ...prev, [cycleId]: Math.min((prev[cycleId] || 0) + 1, PHASES.length - 1) }));
  }

  function getTotals(phaseId) {
    const txs = transactions[phaseId] || [];
    return txs.reduce((totals, tx) => {
      if (tx.type === 'expense') totals.expenses += tx.amount;
      if (tx.type === 'sale') totals.sales += tx.amount;
      if (tx.type === 'harvest') totals.harvest += tx.amount;
      return totals;
    }, { expenses: 0, sales: 0, harvest: 0 });
  }

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, Segoe UI, Arial, sans-serif', background: '#181a1b', minHeight: '100vh' }}>
      <h2 style={{ fontWeight: 800, fontSize: 32, marginBottom: 28, color: '#fff', letterSpacing: 1 }}>Lim Fishpond Croppings Cycles</h2>
      <div style={{ marginBottom: 28, display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
        <button 
          onClick={openCycleModal}
          style={{
            padding: '10px 0',
            minWidth: 120,
            borderRadius: 8,
            background: '#23272a',
            color: '#fff',
            border: 'none',
            fontWeight: 500,
            fontSize: 14,
            boxShadow: '0 1px 4px #181a1b',
            cursor: 'pointer',
            transition: 'background 0.2s',
            opacity: 1,
            textAlign: 'center',
            marginRight: 8
          }}
        >Add Cycle</button>
        <button 
          onClick={() => openTxModal(null)}
          style={{
            padding: '10px 0',
            minWidth: 120,
            borderRadius: 8,
            background: '#23272a',
            color: '#fff',
            border: 'none',
            fontWeight: 500,
            fontSize: 14,
            boxShadow: '0 1px 4px #181a1b',
            cursor: 'pointer',
            transition: 'background 0.2s',
            opacity: 1,
            textAlign: 'center'
          }}
        >Add Transaction</button>
      </div>
      {loading ? <p style={{ color: '#fff' }}>Loading...</p> : null}
      {cycles.length === 0 && <p style={{ color: '#b9bbbe' }}>No cycles yet.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        {cycles.map(cycle => (
          <div key={cycle.id} style={{ background: '#23272a', borderRadius: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.10)', padding: 32, marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
              <span style={{ fontWeight: 700, fontSize: 24, color: '#fff', letterSpacing: 0.5 }}>{cycle.name}</span>
              <button 
                style={{
                  marginLeft: 16,
                  padding: '6px 12px',
                  borderRadius: 6,
                  background: '#e55353',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 14,
                  boxShadow: '0 1px 4px #e5535333',
                  transition: 'background 0.2s',
                  opacity: 0.85
                }} 
                onClick={() => deleteCycle(cycle.id)}
                title="Delete cycle"
              >
                <span style={{ display: 'inline-block', verticalAlign: 'middle', fontSize: 15, marginRight: 4 }}>🗑️</span>
                Delete
              </button>
            </div>
            {phases[cycle.id] ? (
              <>
                <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 18 }}>
                  <span style={{ fontWeight: 600, fontSize: 18, color: '#fff' }}>Current Phase:</span>
                  <span style={{ fontWeight: 700, fontSize: 20, color: '#7289da', background: '#181a1b', borderRadius: 8, padding: '6px 18px', boxShadow: '0 2px 8px #7289da33', letterSpacing: 0.5 }}>
                    {phases[cycle.id][activePhase[cycle.id]]?.name || 'N/A'}
                  </span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16, background: '#23272a', color: '#fff' }}>
                  <thead>
                    <tr style={{ background: '#181a1b' }}>
                      <th style={{ fontWeight: 700, fontSize: 18, padding: '14px 8px', textAlign: 'left', borderBottom: '2px solid #7289da' }}>Phase</th>
                      <th style={{ fontWeight: 700, fontSize: 18, padding: '14px 8px', textAlign: 'center', borderBottom: '2px solid #7289da' }}>Expenses</th>
                      <th style={{ fontWeight: 700, fontSize: 18, padding: '14px 8px', textAlign: 'center', borderBottom: '2px solid #7289da' }}>Sales</th>
                      <th style={{ fontWeight: 700, fontSize: 18, padding: '14px 8px', textAlign: 'center', borderBottom: '2px solid #7289da' }}>Harvest</th>
                      <th style={{ fontWeight: 700, fontSize: 18, padding: '14px 8px', textAlign: 'center', borderBottom: '2px solid #7289da' }}>Add Transaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {phases[cycle.id].map((phase, idx) => {
                      const totals = getTotals(phase.id);
                      const isActive = activePhase[cycle.id] === idx;
                      return (
                        <tr key={phase.id} style={{ background: isActive ? '#2c2f33' : '#23272a', borderBottom: '1px solid #36393f' }}>
                          <td style={{ fontWeight: 600, fontSize: 16, padding: '12px 8px', color: isActive ? '#7289da' : '#fff' }}>{phase.name}</td>
                          <td style={{ textAlign: 'center', fontSize: 16 }}>{totals.expenses}</td>
                          <td style={{ textAlign: 'center', fontSize: 16 }}>{totals.sales}</td>
                          <td style={{ textAlign: 'center', fontSize: 16 }}>{totals.harvest}</td>
                          <td style={{ textAlign: 'center', fontSize: 16 }}>
                            {isActive && idx < PHASES.length - 1 && (
                              <button 
                                style={{
                                  marginTop: 8,
                                  padding: '10px 0',
                                  minWidth: 120,
                                  borderRadius: 8,
                                  background: '#23272a',
                                  color: '#fff',
                                  border: 'none',
                                  fontWeight: 500,
                                  fontSize: 14,
                                  boxShadow: '0 1px 4px #181a1b',
                                  cursor: 'pointer',
                                  transition: 'background 0.2s',
                                  opacity: 1,
                                  textAlign: 'center'
                                }}
                                onClick={() => handleNextPhase(cycle.id)}
                                title="Next phase"
                              >Next Phase</button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div style={{ marginTop: 12 }}>
                  <strong style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Transactions:</strong>
                  {phases[cycle.id].map((phase, idx) => (
                    <div key={phase.id} style={{ marginBottom: 8 }}>
                      <span style={{ fontWeight: 600, color: '#7289da' }}>{phase.name}:</span>
                      <ul style={{ margin: '4px 0 0 0', padding: 0, listStyle: 'none' }}>
                        {(transactions[phase.id] || []).map(tx => (
                          <li key={tx.id} style={{ background: '#181a1b', border: '1px solid #36393f', borderRadius: 8, marginBottom: 4, padding: '6px 14px', fontSize: 15, color: '#fff' }}>
                            <strong style={{ color: '#fff' }}>{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</strong>: ₱{tx.amount} <span style={{ color: '#b9bbbe' }}>{tx.description}</span>
                          </li>
                        ))}
                        {(transactions[phase.id] || []).length === 0 && <li style={{ color: '#b9bbbe', fontStyle: 'italic' }}>No transactions yet.</li>}
                      </ul>
                    </div>
                  ))}
                </div>
              </>
            ) : <p style={{ color: '#b9bbbe' }}>No phases.</p>}
          </div>
        ))}
      </div>
      {showTxModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(24,26,27,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#23272a', borderRadius: 16, boxShadow: '0 2px 24px rgba(0,0,0,0.18)', padding: 32, minWidth: 340, maxWidth: 400 }}>
            <h3 style={{ fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 18 }}>Add Transaction</h3>
            <form onSubmit={handleTxModalSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <select
                  value={modalPhaseId || ''}
                  onChange={e => setModalPhaseId(e.target.value)}
                  style={{ padding: '10px', borderRadius: 8, border: '1px solid #36393f', fontSize: 16, background: '#181a1b', color: '#fff' }}
                  required
                >
                  <option value="">Select Phase</option>
                  {Object.values(phases).flat().map(phase => (
                    <option key={phase.id} value={phase.id}>{phase.name}</option>
                  ))}
                </select>
                <select
                  value={newTx[modalPhaseId]?.type || ''}
                  onChange={e => setNewTx({ ...newTx, [modalPhaseId]: { ...newTx[modalPhaseId], type: e.target.value } })}
                  style={{ padding: '10px', borderRadius: 8, border: '1px solid #36393f', fontSize: 16, background: '#181a1b', color: '#fff' }}
                  required
                >
                  <option value="">Type</option>
                  <option value="expense">Expense</option>
                  <option value="sale">Sale</option>
                  <option value="harvest">Harvest</option>
                </select>
                <input
                  type="number"
                  placeholder="Amount"
                  value={newTx[modalPhaseId]?.amount || ''}
                  onChange={e => setNewTx({ ...newTx, [modalPhaseId]: { ...newTx[modalPhaseId], amount: e.target.value } })}
                  style={{ padding: '10px', borderRadius: 8, border: '1px solid #36393f', fontSize: 16, background: '#181a1b', color: '#fff' }}
                  required
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newTx[modalPhaseId]?.description || ''}
                  onChange={e => setNewTx({ ...newTx, [modalPhaseId]: { ...newTx[modalPhaseId], description: e.target.value } })}
                  style={{ padding: '10px', borderRadius: 8, border: '1px solid #36393f', fontSize: 16, background: '#181a1b', color: '#fff' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button 
                  type="button" 
                  onClick={closeTxModal} 
                  style={{
                    padding: '10px 0',
                    minWidth: 120,
                    borderRadius: 8,
                    background: '#23272a',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 500,
                    fontSize: 14,
                    boxShadow: '0 1px 4px #181a1b',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    opacity: 1,
                    textAlign: 'center',
                    marginRight: 8
                  }}
                >Cancel</button>
                <button 
                  type="submit" 
                  style={{
                    padding: '10px 0',
                    minWidth: 120,
                    borderRadius: 8,
                    background: '#23272a',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 500,
                    fontSize: 14,
                    boxShadow: '0 1px 4px #181a1b',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    opacity: 1,
                    textAlign: 'center'
                  }}
                >Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCycleModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(24,26,27,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#23272a', borderRadius: 16, boxShadow: '0 2px 24px rgba(0,0,0,0.18)', padding: 32, minWidth: 340, maxWidth: 400 }}>
            <h3 style={{ fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 18 }}>Add Cropping Cycle</h3>
            <form onSubmit={handleCycleModalSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input
                  type="text"
                  placeholder="New cycle name"
                  value={newCycleName}
                  onChange={e => setNewCycleName(e.target.value)}
                  style={{ padding: '10px', borderRadius: 8, border: '1px solid #36393f', fontSize: 16, background: '#181a1b', color: '#fff' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                <button 
                  type="button" 
                  onClick={closeCycleModal} 
                  style={{
                    padding: '10px 0',
                    minWidth: 120,
                    borderRadius: 8,
                    background: '#23272a',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 500,
                    fontSize: 14,
                    boxShadow: '0 1px 4px #181a1b',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    opacity: 1,
                    textAlign: 'center',
                    marginRight: 8
                  }}
                >Cancel</button>
                <button 
                  type="submit" 
                  style={{
                    padding: '10px 0',
                    minWidth: 120,
                    borderRadius: 8,
                    background: '#23272a',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 500,
                    fontSize: 14,
                    boxShadow: '0 1px 4px #181a1b',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    opacity: 1,
                    textAlign: 'center'
                  }}
                >Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CroppingCyclesPage;

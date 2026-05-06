"use client";

import React, { useEffect, useState } from "react";
import { API_BASE } from "@/config/apiConfig";
import { Plus, Search, Table, Trello, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CRMDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'mine' | 'assigned' | 'unassigned'>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [newLead, setNewLead] = useState({
    companyName: '',
    businessDomain: '',
    contacts: [{ name: '', email: '', mobile: '', designation: '' }],
    source: 'Website',
    serviceInterest: '',
    dealValue: 0,
    comments: '',
    leadOwner: '',
    assignedTo: ''
  });

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      let url = `${API_BASE}/crm/leads?`;
      if (activeFilter === 'unassigned') url += `assignment=unassigned&`;
      if (sourceFilter !== 'all') url += `source=${encodeURIComponent(sourceFilter)}&`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/crm/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("admin_user");
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [activeFilter, sourceFilter]);

  const isAdmin = currentUser?.role === 'admin';
  const isMarketingUser = currentUser?.department === 'Marketing & Sales';

  const filteredLeads = leads.filter(l => {
    if (activeFilter === 'mine') return (l.leadOwner?._id || l.leadOwner) === currentUser?._id;
    if (activeFilter === 'assigned') return (l.assignedTo?._id || l.assignedTo) === currentUser?._id;
    if (activeFilter === 'unassigned') return !l.assignedTo;
    return true;
  });

  const STAGES = ['New Lead', 'Contacted', 'Qualification', 'Proposal Sent', 'Negotiation', 'Won', 'Lost', 'On Hold'];

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Minimal Frontend Validation: At least one contact field must be filled
      const c = newLead.contacts[0];
      if (!c.name && !c.email && !c.mobile) {
        alert("Minimal info required: Please provide at least Name, Email or Phone for the lead.");
        return;
      }

      const token = localStorage.getItem("admin_token");
      const url = editingLeadId 
        ? `${API_BASE}/crm/leads/${editingLeadId}` 
        : `${API_BASE}/crm/leads`;
      const method = editingLeadId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(newLead)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingLeadId(null);
        setNewLead({ 
          companyName: '', businessDomain: '', contacts: [{ name: '', email: '', mobile: '', designation: '' }],
          source: 'Website', serviceInterest: '', dealValue: 0, comments: '', leadOwner: '', assignedTo: '' 
        });
        fetchLeads();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (lead: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingLeadId(lead._id);
    setNewLead({
      companyName: lead.companyName || '',
      businessDomain: lead.businessDomain || '',
      contacts: lead.contacts && lead.contacts.length > 0 
        ? lead.contacts 
        : [{ name: '', email: '', mobile: '', designation: '' }],
      source: lead.source || 'Website',
      serviceInterest: lead.serviceInterest || '',
      dealValue: lead.dealValue || 0,
      comments: lead.comments || '',
      leadOwner: lead.leadOwner?._id || lead.leadOwner || '',
      assignedTo: lead.assignedTo?._id || lead.assignedTo || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteLead = async (leadId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this lead? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/crm/leads/${leadId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setLeads(leads.filter(l => l._id !== leadId));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete lead.");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      alert("An error occurred while deleting the lead.");
    }
  };

  const handleDrop = async (leadId: string, newStatus: string) => {
    // Optimistic update
    setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status: newStatus } : l));
    
    try {
      const token = localStorage.getItem("admin_token");
      await fetch(`${API_BASE}/crm/leads/${leadId}/status`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error("Failed to update status");
      fetchLeads(); // Revert on failure
    }
  };

  if (loading) return <div className="p-10 text-center">Loading CRM...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h2 className="text-2xl font-bold text-zinc-900">Sales Pipeline</h2>
          
          <div className="flex bg-zinc-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeFilter === 'all' ? 'bg-white shadow-sm text-primary' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              All Leads
            </button>
            <button 
              onClick={() => setActiveFilter('mine')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeFilter === 'mine' ? 'bg-white shadow-sm text-primary' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              My Leads (Owner)
            </button>
            <button 
              onClick={() => setActiveFilter('assigned')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeFilter === 'assigned' ? 'bg-white shadow-sm text-primary' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              Assigned to Me
            </button>
            {isAdmin && (
              <button 
                onClick={() => setActiveFilter('unassigned')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeFilter === 'unassigned' ? 'bg-white shadow-sm text-amber-600' : 'text-zinc-500 hover:text-zinc-700'}`}
              >
                Not Assigned
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-zinc-200">
            <span className="text-[10px] font-black uppercase text-zinc-400">Source:</span>
            <select 
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="text-xs font-bold bg-transparent outline-none border-none cursor-pointer text-zinc-700"
            >
              <option value="all">All Sources</option>
              <option value="Website Enquiry">Website Enquiry</option>
              <option value="Manual">Manual</option>
              <option value="Referral">Referral</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex bg-zinc-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors ${viewMode === 'kanban' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500'}`}
            >
              <Trello size={16} /> Kanban
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500'}`}
            >
              <Table size={16} /> List
            </button>
          </div>
          <button 
            onClick={() => {
              setEditingLeadId(null);
              setNewLead({ 
                companyName: '', businessDomain: '', contacts: [{ name: '', email: '', mobile: '', designation: '' }],
                source: 'Website', serviceInterest: '', dealValue: 0, comments: '', 
                leadOwner: currentUser?._id || '', 
                assignedTo: currentUser?._id || '' 
              });
              setIsModalOpen(true);
            }}
            className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/90"
          >
            <Plus size={16} /> New Lead
          </button>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
          {STAGES.map(stage => {
            const stageLeads = filteredLeads.filter(l => l.status === stage);
            return (
              <div 
                key={stage} 
                className="min-w-[300px] flex-shrink-0 snap-start bg-zinc-100/50 rounded-2xl p-4 flex flex-col h-[calc(100vh-240px)]"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const leadId = e.dataTransfer.getData("leadId");
                  if (leadId) handleDrop(leadId, stage);
                }}
              >
                <div className="flex items-center justify-between mb-4 px-2">
                  <h3 className="font-bold text-zinc-700">{stage}</h3>
                  <span className="bg-white text-xs font-bold px-2 py-1 rounded-full shadow-sm text-zinc-500">{stageLeads.length}</span>
                </div>
                
                <div className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {stageLeads.map(lead => (
                    <div 
                      key={lead._id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("leadId", lead._id)}
                      className="bg-white p-4 rounded-xl shadow-sm border border-zinc-200 cursor-grab active:cursor-grabbing hover:border-primary/50 hover:shadow-md transition-all relative group"
                    >
                      <button 
                        onClick={(e) => handleEditClick(lead, e)}
                        className="absolute top-3 right-3 p-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-400 hover:text-primary rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10"
                        title="Edit Lead"
                      >
                        <Pencil size={14} />
                      </button>
                      {isAdmin && (
                        <button 
                          onClick={(e) => handleDeleteLead(lead._id, e)}
                          className="absolute top-3 right-10 p-1.5 bg-zinc-50 hover:bg-red-50 text-zinc-400 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10"
                          title="Delete Lead"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                      <Link href={`/admin-dashboard/crm/lead/${lead._id}`}>
                        <div className="flex justify-between items-start mb-2 pr-8">
                          <span className="text-[10px] font-black tracking-widest uppercase text-primary bg-primary/10 px-2 py-1 rounded-md">{lead.leadId}</span>
                          <div className="flex flex-col items-end gap-1">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${lead.source === 'Website Enquiry' ? 'bg-blue-100 text-blue-600' : 'bg-zinc-100 text-zinc-500'}`}>
                              {lead.source === 'Website Enquiry' ? '🌐 Website' : lead.source}
                            </span>
                            {!lead.assignedTo && (
                              <span className="text-[9px] font-black bg-amber-100 text-amber-600 px-2 py-0.5 rounded-md animate-pulse">🟡 UNASSIGNED</span>
                            )}
                          </div>
                        </div>
                        <h4 className="font-bold text-zinc-900 mb-0.5">{lead.companyName}</h4>
                        <div className="flex flex-col mb-3">
                          <p className="text-xs font-bold text-primary flex items-center gap-1 mb-1">
                            <span className="opacity-70">🎯</span> {lead.serviceInterest || 'General Enquiry'}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] text-zinc-500 font-medium">{lead.contacts?.[0]?.name || 'No Contact'}</p>
                            <p className="text-[9px] text-zinc-400 font-bold">{new Date(lead.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Assignee</span>
                            <span className="text-[11px] font-bold text-zinc-700 truncate max-w-[100px]">
                              {lead.assignedTo?.email?.split('@')[0] || 'N/A'}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-emerald-600">₹{lead.dealValue?.toLocaleString() || 0}</span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Lead ID</th>
                 <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Company</th>
                <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Contact</th>
                <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Service</th>
                <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Added On</th>
                <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Value</th>
                <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Assigned To</th>
                <th className="p-4 text-xs font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map(lead => (
                <tr 
                  key={lead._id} 
                  onClick={() => router.push(`/admin-dashboard/crm/lead/${lead._id}`)}
                  className="border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer"
                >
                  <td className="p-4 text-sm font-bold text-primary">
                    {lead.leadId}
                  </td>
                  <td className="p-4 text-sm font-bold text-zinc-900">{lead.companyName}</td>
                  <td className="p-4 text-sm text-zinc-500">{lead.contacts?.[0]?.name || 'N/A'}</td>
                  <td className="p-4">
                    <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded-md border border-primary/10">
                      {lead.serviceInterest || 'General'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-bold px-2 py-1 bg-zinc-100 text-zinc-600 rounded-lg">{lead.status}</span>
                  </td>
                  <td className="p-4 text-xs font-medium text-zinc-500 whitespace-nowrap">
                    {new Date(lead.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td className="p-4 text-sm font-bold text-emerald-600">₹{lead.dealValue?.toLocaleString() || 0}</td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {lead.assignedTo ? (
                        <>
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Owner: {lead.leadOwner?.email?.split('@')[0] || 'N/A'}</span>
                          <span className="text-sm font-medium text-zinc-600">To: {lead.assignedTo?.email?.split('@')[0] || 'N/A'}</span>
                        </>
                      ) : (
                        <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100 inline-block w-fit">🟡 NOT ASSIGNED</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={(e) => handleEditClick(lead, e)}
                        className="p-2 text-zinc-400 hover:text-primary hover:bg-zinc-100 rounded-lg transition-colors inline-flex"
                        title="Edit Lead"
                      >
                        <Pencil size={16} />
                      </button>
                      {isAdmin && (
                        <button 
                          onClick={(e) => handleDeleteLead(lead._id, e)}
                          className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex"
                          title="Delete Lead"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">No leads found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* New/Edit Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="p-8 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-zinc-900">{editingLeadId ? "Edit Lead" : "Add New Lead"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">✕</button>
            </div>
            <form onSubmit={handleSubmitLead} className="p-8 space-y-6">
              <div className="space-y-6">
                {/* Section 1: Company Info */}
                <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                  <h3 className="text-sm font-bold text-zinc-900 mb-4 border-b border-zinc-200 pb-2">Company Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Company Name</label>
                      <input type="text" value={newLead.companyName} onChange={e => setNewLead({...newLead, companyName: e.target.value})} className="w-full p-3 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Business Domain</label>
                      <input type="text" placeholder="e.g. IT Services, Healthcare" value={newLead.businessDomain} onChange={e => setNewLead({...newLead, businessDomain: e.target.value})} className="w-full p-3 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Lead Source</label>
                      <select value={newLead.source} onChange={e => setNewLead({...newLead, source: e.target.value})} className="w-full p-3 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm bg-white font-bold">
                        <option value="Manual">Manual Entry</option>
                        <option value="Website Enquiry">Website Enquiry</option>
                        <option value="Referral">Referral</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Cold Outreach">Cold Outreach</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Service Interest</label>
                      <input type="text" placeholder="e.g. Web Development" value={newLead.serviceInterest} onChange={e => setNewLead({...newLead, serviceInterest: e.target.value})} className="w-full p-3 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm bg-white" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Estimated Deal Value (₹)</label>
                      <input type="number" min="0" value={newLead.dealValue} onChange={e => setNewLead({...newLead, dealValue: Number(e.target.value)})} className="w-full p-3 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm bg-white" />
                    </div>
                  </div>
                </div>

                {/* Section 2: Contacts */}
                <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-2 mb-4">
                    <h3 className="text-sm font-bold text-zinc-900">Contact Details</h3>
                    <button type="button" onClick={() => setNewLead({...newLead, contacts: [...newLead.contacts, { name: '', email: '', mobile: '', designation: '' }]})} className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1">
                      <Plus size={14} /> Add Contact
                    </button>
                  </div>
                  <div className="space-y-4">
                    {newLead.contacts.map((contact, index) => (
                      <div key={index} className="p-4 bg-white border border-zinc-200 rounded-xl relative">
                        {index > 0 && (
                          <button type="button" onClick={() => {
                            const newContacts = [...newLead.contacts];
                            newContacts.splice(index, 1);
                            setNewLead({...newLead, contacts: newContacts});
                          }} className="absolute top-2 right-2 text-red-400 hover:text-red-600 font-bold text-xs">Remove</button>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Name</label>
                            <input type="text" value={contact.name} onChange={e => {
                              const newContacts = [...newLead.contacts];
                              newContacts[index].name = e.target.value;
                              setNewLead({...newLead, contacts: newContacts});
                            }} className="w-full p-2 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Email</label>
                            <input type="email" value={contact.email} onChange={e => {
                              const newContacts = [...newLead.contacts];
                              newContacts[index].email = e.target.value;
                              setNewLead({...newLead, contacts: newContacts});
                            }} className="w-full p-2 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Mobile</label>
                            <input type="text" value={contact.mobile} onChange={e => {
                              const newContacts = [...newLead.contacts];
                              newContacts[index].mobile = e.target.value;
                              setNewLead({...newLead, contacts: newContacts});
                            }} className="w-full p-2 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Designation</label>
                            <input type="text" placeholder="e.g. CEO" value={contact.designation} onChange={e => {
                              const newContacts = [...newLead.contacts];
                              newContacts[index].designation = e.target.value;
                              setNewLead({...newLead, contacts: newContacts});
                            }} className="w-full p-2 border border-zinc-200 rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Notes & Assignment */}
                <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                  <h3 className="text-sm font-bold text-zinc-900 mb-4 border-b border-zinc-200 pb-2">Notes & Assignment</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Initial Comments / Notes</label>
                      <textarea rows={3} value={newLead.comments} onChange={e => setNewLead({...newLead, comments: e.target.value})} className="w-full p-3 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm bg-white" placeholder="Add any initial discussion notes here..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Lead Owner (Creator)</label>
                      <div className="w-full p-3 border border-zinc-100 rounded-xl text-sm bg-zinc-50 text-zinc-400 font-bold">
                        {editingLeadId 
                          ? (leads.find(l => l._id === editingLeadId)?.leadOwner?.email || "N/A")
                          : (currentUser?.email || "You")
                        }
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
                        Assign To (Follow-up person) {newLead.source !== 'Website Enquiry' && !isMarketingUser && "*"}
                      </label>
                      <select 
                        required={newLead.source !== 'Website Enquiry' && !isMarketingUser} 
                        value={newLead.assignedTo} 
                        onChange={e => setNewLead({...newLead, assignedTo: e.target.value})} 
                        className="w-full p-3 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm bg-white font-bold"
                      >
                        <option value="">-- {newLead.source === 'Website Enquiry' ? 'Not Assigned' : (isMarketingUser ? "Select Assignee (Optional)" : "Select Marketing Team Member *")} --</option>
                        {users.map(u => (
                          <option key={u._id} value={u._id}>{u.employeeRef?.fullName || u.email} ({u.role})</option>
                        ))}
                      </select>
                      <p className="mt-1 text-[10px] text-zinc-400 font-medium italic">
                        {newLead.source === 'Website Enquiry' 
                          ? "Website enquiries start as 'Not Assigned' until delegated"
                          : (isMarketingUser ? "Optional – you can assign this lead or handle it yourself" : "Required – please assign to Marketing team for follow-up")}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
              <div className="flex justify-end gap-4 pt-6 border-t border-zinc-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-zinc-500 hover:bg-zinc-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-6 py-3 font-bold bg-primary text-white rounded-xl hover:bg-primary/90">
                  {editingLeadId ? "Update Lead" : "Create Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

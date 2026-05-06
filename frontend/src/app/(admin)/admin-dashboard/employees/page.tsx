"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Plus, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  ChevronRight, 
  Filter,
  Trash2,
  Edit,
  X,
  ClipboardList,
  Download
} from "lucide-react";
import { API_BASE } from "@/config/apiConfig";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    personalEmail: "",
    phone: "",
    department: "",
    designation: "",
    employmentType: "Full-time",
    dateOfJoining: "",
    religion: ""
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, debouncedSearch]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        search: debouncedSearch
      });
      const res = await fetch(`${API_BASE}/employees?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setEmployees(data.employees || []);
      setTotalPages(data.pages || 1);
      setTotalItems(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadOnboardingData = async (empId: string, name: string) => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/employees/${empId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Branded Header
      doc.setFillColor(24, 24, 27); // Dark zinc
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("TATTVALOGIC", 15, 20);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Official Employee Onboarding Dossier", 15, 28);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 15, 28, { align: "right" });

      // Basic Information Table
      autoTable(doc, {
        startY: 50,
        head: [['Basic Employment Details', '']],
        body: [
          ['Employee ID', data.employeeId || 'N/A'],
          ['Full Name', data.fullName || 'N/A'],
          ['Official Email', data.email || 'N/A'],
          ['Personal Email', data.personalEmail || 'N/A'],
          ['Department', data.department || 'N/A'],
          ['Designation', data.designation || 'N/A'],
          ['Joining Date', data.dateOfJoining ? new Date(data.dateOfJoining).toLocaleDateString() : 'N/A'],
          ['Employment Type', data.employmentType || 'Full-time']
        ],
        theme: 'striped',
        headStyles: { fillColor: [255, 79, 0], textColor: [255, 255, 255] }, // TattvaLogic Primary
      });

      // Personal Details Table
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [['Personal Information', '']],
        body: [
          ['Date of Birth', data.personalDetails?.dob ? new Date(data.personalDetails.dob).toLocaleDateString() : 'N/A'],
          ['Gender', data.personalDetails?.gender || 'N/A'],
          ['Aadhaar Number', data.personalDetails?.aadhaarNumber || 'N/A'],
          ['PAN Number', data.personalDetails?.panNumber || 'N/A'],
          ['Current Address', `${data.personalDetails?.currentAddress?.line1 || ''}, ${data.personalDetails?.currentAddress?.city || ''}, ${data.personalDetails?.currentAddress?.state || ''} - ${data.personalDetails?.currentAddress?.pincode || ''}`],
          ['Permanent Address', `${data.personalDetails?.permanentAddress?.line1 || ''}, ${data.personalDetails?.permanentAddress?.city || ''}, ${data.personalDetails?.permanentAddress?.state || ''} - ${data.personalDetails?.permanentAddress?.pincode || ''}`]
        ],
        theme: 'grid',
        headStyles: { fillColor: [244, 244, 245], textColor: [24, 24, 27] },
      });

      // Family Background Table
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [['Family Background & Emergency Contact', '']],
        body: [
          ['Father\'s Name', data.familyBackground?.fatherName || 'N/A'],
          ['Mother\'s Name', data.familyBackground?.motherName || 'N/A'],
          ['Marital Status', data.familyBackground?.maritalStatus || 'N/A'],
          ['Spouse Name', data.familyBackground?.spouseName || 'N/A'],
          ['Emergency Contact', data.familyBackground?.emergencyContactName || 'N/A'],
          ['Emergency Phone', data.familyBackground?.emergencyContactNumber || 'N/A']
        ],
        theme: 'grid',
        headStyles: { fillColor: [244, 244, 245], textColor: [24, 24, 27] },
      });

      // Bank Details Table
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [['Banking & Financial Information', '']],
        body: [
          ['Bank Name', data.bankDetails?.bankName || 'N/A'],
          ['Account Number', data.bankDetails?.accountNumber || 'N/A'],
          ['IFSC Code', data.bankDetails?.ifscCode || 'N/A'],
          ['Account Type', data.bankDetails?.accountType || 'N/A'],
          ['Bank Address', data.bankDetails?.bankAddress || 'N/A'],
          ['VPA / UPI', data.bankDetails?.vpa || 'N/A']
        ],
        theme: 'grid',
        headStyles: { fillColor: [244, 244, 245], textColor: [24, 24, 27] },
      });

      // Work Experience
      if (data.workExperience && data.workExperience.length > 0) {
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 10,
          head: [['Work Experience History', 'Designation', 'Duration', 'Contact Info']],
          body: data.workExperience.map((exp: any) => [
            exp.organizationName,
            exp.designation,
            `${new Date(exp.startDate).toLocaleDateString()} - ${exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}`,
            `${exp.contactPersonName || ''} (${exp.contactPersonEmail || ''})`
          ]),
          theme: 'striped',
          headStyles: { fillColor: [244, 244, 245], textColor: [24, 24, 27] },
        });
      }

      // References
      if (data.references && data.references.length > 0) {
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 10,
          head: [['Professional References', 'Company', 'Contact Info']],
          body: data.references.map((ref: any) => [
            ref.name,
            ref.company,
            ref.contact
          ]),
          theme: 'grid',
          headStyles: { fillColor: [244, 244, 245], textColor: [24, 24, 27] },
        });
      }

      // Health Details
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [['Health & Medical Details', '']],
        body: [
          ['Blood Group', data.healthDetails?.bloodGroup || 'N/A'],
          ['Height (cm)', data.healthDetails?.height || 'N/A'],
          ['Weight (kg)', data.healthDetails?.weight || 'N/A'],
          ['Medical Notes', data.healthDetails?.medicalNotes || 'No specific notes']
        ],
        theme: 'grid',
        headStyles: { fillColor: [244, 244, 245], textColor: [24, 24, 27] },
      });

      // Declaration Summary
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [['Declaration & Criminal Record Check', '']],
        body: [
          ['Criminal Record', data.declaration?.hasCriminalRecord ? `YES - ${data.declaration.criminalDetails}` : 'No'],
          ['Self Declaration', data.declaration?.accepted ? 'Accepted & Signed Electronically' : 'Pending'],
          ['Signed At', data.declaration?.acceptedAt ? new Date(data.declaration.acceptedAt).toLocaleString() : 'N/A']
        ],
        theme: 'grid',
        headStyles: { fillColor: [244, 244, 245], textColor: [24, 24, 27] },
      });

      // Footer
      const finalY = (doc as any).lastAutoTable.finalY + 20;
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("This is an electronically generated document from the TattvaLogic HR Portal.", 15, finalY);
      doc.text("© 2026 TattvaLogic. Confidential and Proprietary.", 15, finalY + 5);

      doc.save(`TattvaLogic_Dossier_${name.replace(/\s+/g, '_')}_${data.employeeId}.pdf`);

    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF dossier.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("admin_token");
      const url = editId ? `${API_BASE}/employees/${editId}` : `${API_BASE}/employees`;
      const method = editId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowAddModal(false);
        setEditId(null);
        setFormData({
          fullName: "",
          email: "",
          personalEmail: "",
          phone: "",
          department: "",
          designation: "",
          employmentType: "Full-time",
          dateOfJoining: "",
          religion: ""
        });
        fetchEmployees();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message || 'Failed to save record'}`);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving.");
    }
  };

  const openEditModal = (emp: any) => {
    setEditId(emp._id);
    setFormData({
      fullName: emp.fullName || "",
      email: emp.email || "",
      personalEmail: emp.personalEmail || "",
      phone: emp.phone || "",
      department: emp.department || "",
      designation: emp.designation || "",
      employmentType: emp.employmentType || "Full-time",
      dateOfJoining: emp.dateOfJoining ? new Date(emp.dateOfJoining).toISOString().split('T')[0] : "",
      religion: emp.religion || ""
    });
    setShowAddModal(true);
  };

  const openAddModal = () => {
    setEditId(null);
    setFormData({
      fullName: "",
      email: "",
      personalEmail: "",
      phone: "",
      department: "",
      designation: "",
      employmentType: "Full-time",
      dateOfJoining: "",
      religion: ""
    });
    setShowAddModal(true);
  };

  const deleteEmployee = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee? This will also remove their portal access.")) return;
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/employees/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const calculateProgress = (emp: any) => {
    if (emp.onboardingStatus === 'Completed') return 100;
    if (!emp.onboardingStatus || emp.onboardingStatus === 'Not Started') return 0;
    
    let fields = [
      emp.personalDetails?.dob, 
      emp.personalDetails?.gender, 
      emp.personalDetails?.currentAddress?.line1, 
      emp.personalDetails?.currentAddress?.city, 
      emp.personalDetails?.currentAddress?.state, 
      emp.personalDetails?.currentAddress?.pincode,
      emp.personalDetails?.aadhaarNumber, 
      emp.personalDetails?.panNumber,
      emp.professionalDetails?.previousEmployer,
      emp.familyBackground?.fatherName, 
      emp.familyBackground?.maritalStatus, 
      emp.familyBackground?.emergencyContactNumber,
      emp.bankDetails?.bankName, 
      emp.bankDetails?.accountNumber, 
      emp.bankDetails?.ifscCode, 
      emp.bankDetails?.bankAddress
    ];
    let filled = fields.filter(f => f && String(f).trim().length > 0).length;
    // Account for 5 document uploads in the denominator (16 fields + 5 docs = 21)
    let progress = Math.min(95, Math.round((filled / 21) * 100));
    return progress;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search employees..." 
            className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <button 
          onClick={openAddModal}
          className="w-full md:w-auto bg-zinc-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
        >
          <Plus size={18} /> Add Employee
        </button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Employee ID</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Full Name</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Department</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Joining Date</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr><td colSpan={6} className="p-20 text-center text-zinc-400">Loading records...</td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan={6} className="p-20 text-center text-zinc-400 italic">No employee records found.</td></tr>
              ) : employees.map((emp) => (
                <tr key={emp._id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <span className="font-mono text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded-lg border border-primary/10">
                      {emp.employeeId}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-zinc-200 bg-zinc-100 flex items-center justify-center flex-shrink-0">
                        {emp.photoUrl ? (
                          <img
                            src={`${API_BASE.replace('/api', '')}${emp.photoUrl}`}
                            alt={emp.fullName}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as any).style.display = 'none'; }}
                          />
                        ) : (
                          <span className="text-xs font-black text-zinc-400 group-hover:text-primary transition-colors">
                            {emp.fullName?.charAt(0)?.toUpperCase() || <User size={14} />}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 leading-none mb-1">{emp.fullName}</p>
                        <p className="text-xs text-zinc-400 font-sans">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-zinc-600 font-sans">{emp.department}</td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-zinc-700">{emp.dateOfJoining ? new Date(emp.dateOfJoining).toLocaleDateString() : 'N/A'}</p>
                    <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest">{emp.employmentType || 'Full-time'}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        emp.status === 'Active' ? 'bg-emerald-100 text-emerald-600' :
                        emp.status === 'Onboarding' ? 'bg-amber-100 text-amber-600' :
                        'bg-zinc-100 text-zinc-600'
                      }`}>
                        {emp.status}
                      </span>
                      {emp.onboardingStatus && (
                        <span className={`text-[9px] font-bold ml-1 ${calculateProgress(emp) === 100 ? 'text-emerald-500' : 'text-zinc-400'}`}>
                          Onboarding: {emp.onboardingStatus} - {calculateProgress(emp)}%
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin-dashboard/employees/${emp._id}/onboarding`}
                        className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-primary transition-all"
                        title="Start / View Onboarding"
                      >
                        <ClipboardList size={16} />
                      </Link>
                      <button 
                        onClick={() => downloadOnboardingData(emp._id, emp.fullName)}
                        className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-blue-600 transition-all"
                        title="Download Onboarding Dossier"
                      >
                        <Download size={16} />
                      </button>
                      <button onClick={() => openEditModal(emp)} className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-900 transition-all" title="Edit Employee">
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => deleteEmployee(emp._id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-zinc-400 hover:text-red-500 transition-all"
                        title="Delete Employee"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination UI - Reusing previous logic */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
             Showing {employees.length} of {totalItems} Records
           </p>
           <div className="flex items-center gap-2">
             <button 
               onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
               disabled={currentPage === 1 || loading}
               className="p-2 rounded-lg border border-zinc-200 bg-white text-zinc-600 disabled:opacity-50"
             >
               <ChevronRight size={16} className="rotate-180" />
             </button>
             <span className="text-xs font-bold text-zinc-600">Page {currentPage} of {totalPages}</span>
             <button 
               onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
               disabled={currentPage === totalPages || loading}
               className="p-2 rounded-lg border border-zinc-200 bg-white text-zinc-600 disabled:opacity-50"
             >
               <ChevronRight size={16} />
             </button>
           </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <h3 className="text-xl font-bold text-zinc-900">{editId ? "Edit Employee Record" : "New Employee Record"}</h3>
              <button onClick={() => { setShowAddModal(false); setEditId(null); }} className="p-2 hover:bg-white rounded-xl text-zinc-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
                  <input 
                    required
                    type="text"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Official Email (Login ID) *</label>
                  <input 
                    required
                    type="email"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Personal Email</label>
                  <input 
                    type="email"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={formData.personalEmail}
                    onChange={(e) => setFormData({...formData, personalEmail: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Phone</label>
                  <input 
                    type="text"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Department</label>
                  <select 
                    required
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  >
                    <option value="" disabled>Select Department</option>
                    <option value="Marketing & Sales">Marketing & Sales</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Administration">Administration</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Designation</label>
                  <input 
                    type="text"
                    placeholder="e.g. SDE-1"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={formData.designation}
                    onChange={(e) => setFormData({...formData, designation: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Date of Joining</label>
                  <input 
                    type="date"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    value={formData.dateOfJoining}
                    onChange={(e) => setFormData({...formData, dateOfJoining: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Employment Type</label>
                  <select 
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                    value={formData.employmentType}
                    onChange={(e) => setFormData({...formData, employmentType: e.target.value})}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Religion (Optional)</label>
                  <select 
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                    value={formData.religion}
                    onChange={(e) => setFormData({...formData, religion: e.target.value})}
                  >
                    <option value="">Select Religion</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Christian">Christian</option>
                    <option value="Sikh">Sikh</option>
                    <option value="Buddhist">Buddhist</option>
                    <option value="Jain">Jain</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-zinc-900 text-white font-bold py-4 rounded-2xl hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
              >
                {editId ? "Save Changes" : "Create Record"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

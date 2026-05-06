"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  User, 
  Briefcase, 
  Users, 
  FileText, 
  Save, 
  CheckCircle, 
  ArrowLeft,
  Loader2,
  Plus,
  Trash2,
  Download,
  Eye,
  Upload
} from "lucide-react";
import { API_BASE } from "@/config/apiConfig";

const tabs = [
  { id: 'personal', name: 'Personal Details', icon: User },
  { id: 'professional', name: 'Professional Details', icon: Briefcase },
  { id: 'family', name: 'Family Background', icon: Users },
  { id: 'bank', name: 'Bank Details', icon: FileText },
  { id: 'references', name: 'References', icon: Users },
  { id: 'documents', name: 'Documents', icon: FileText },
];

export default function OnboardingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('personal');
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoDragOver, setPhotoDragOver] = useState(false);

  // Form States
  const [personalData, setPersonalData] = useState({
    dob: '',
    gender: '',
    currentAddress: { line1: '', line2: '', city: '', state: '', country: 'India', pincode: '' },
    permanentAddress: { line1: '', line2: '', city: '', state: '', country: 'India', pincode: '' },
    aadhaarNumber: '',
    panNumber: '',
    religion: ''
  });
  const [sameAsCurrent, setSameAsCurrent] = useState(false);

  const [workExperiences, setWorkExperiences] = useState<any[]>([
    {
      organizationName: '',
      designation: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      jobResponsibilities: '',
      contactPersonName: '',
      contactPersonEmail: '',
      contactPersonPhone: ''
    }
  ]);

  const [familyData, setFamilyData] = useState({
    fatherName: '',
    motherName: '',
    maritalStatus: '',
    spouseName: '',
    emergencyContactName: '',
    emergencyContactNumber: ''
  });

  const [bankData, setBankData] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    bankAddress: '',
    accountType: '',
    mmid: '',
    vpa: ''
  });

  const [references, setReferences] = useState<any[]>([
    { name: '', company: '', contact: '' },
    { name: '', company: '', contact: '' }
  ]);

  const [healthData, setHealthData] = useState({
    bloodGroup: '',
    height: '',
    weight: '',
    medicalNotes: ''
  });

  const [declarationData, setDeclarationData] = useState({
    hasCriminalRecord: false,
    criminalDetails: '',
    accepted: false
  });

  useEffect(() => {
    fetchEmployeeDetails();
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (sameAsCurrent) {
      setPersonalData(prev => ({
        ...prev,
        permanentAddress: { ...prev.currentAddress }
      }));
    }
  }, [sameAsCurrent, personalData.currentAddress]);

  const fetchEmployeeDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/employees/${params.id}/onboarding`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setEmployee(data);
      setPhotoUrl(data.photoUrl || null);
      
      // Populate form states with fallbacks
      setPersonalData({
        dob: data.personalDetails?.dob ? new Date(data.personalDetails.dob).toISOString().split('T')[0] : '',
        gender: data.personalDetails?.gender || '',
        currentAddress: typeof data.personalDetails?.currentAddress === 'object' && data.personalDetails.currentAddress !== null
          ? data.personalDetails.currentAddress 
          : { line1: data.personalDetails?.currentAddress || '', line2: '', city: '', state: '', country: 'India', pincode: '' },
        permanentAddress: typeof data.personalDetails?.permanentAddress === 'object' && data.personalDetails.permanentAddress !== null
          ? data.personalDetails.permanentAddress 
          : { line1: data.personalDetails?.permanentAddress || '', line2: '', city: '', state: '', country: 'India', pincode: '' },
        aadhaarNumber: data.personalDetails?.aadhaarNumber || '',
        panNumber: data.personalDetails?.panNumber || '',
        religion: data.religion || ''
      });

      // Infer Same as Current state
      const curr = data.personalDetails?.currentAddress;
      const perm = data.personalDetails?.permanentAddress;
      if (curr && perm && typeof curr === 'object' && typeof perm === 'object') {
        const isSame = curr.line1 === perm.line1 && 
                       curr.city === perm.city && 
                       curr.pincode === perm.pincode &&
                       curr.line1 !== ''; // Don't auto-check if both are empty
        setSameAsCurrent(isSame);
      }
      
      if (data.workExperience && data.workExperience.length > 0) {
        setWorkExperiences(data.workExperience.map((exp: any) => ({
          ...exp,
          startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
          endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''
        })));
      }
      
      setFamilyData({
        fatherName: data.familyBackground?.fatherName || '',
        motherName: data.familyBackground?.motherName || '',
        maritalStatus: data.familyBackground?.maritalStatus || '',
        spouseName: data.familyBackground?.spouseName || '',
        emergencyContactName: data.familyBackground?.emergencyContactName || '',
        emergencyContactNumber: data.familyBackground?.emergencyContactNumber || ''
      });

      setBankData({
        accountHolderName: data.bankDetails?.accountHolderName || '',
        bankName: data.bankDetails?.bankName || '',
        accountNumber: data.bankDetails?.accountNumber || '',
        ifscCode: data.bankDetails?.ifscCode || '',
        bankAddress: data.bankDetails?.bankAddress || '',
        accountType: data.bankDetails?.accountType || '',
        mmid: data.bankDetails?.mmid || '',
        vpa: data.bankDetails?.vpa || ''
      });
      
      if (data.references && data.references.length > 0) {
        // Filter out any completely empty references from the list
        const filteredRefs = data.references.filter((r: any) => r.name || r.company || r.contact);
        
        // Ensure at least 2 slots are shown
        const displayRefs = [...filteredRefs];
        while (displayRefs.length < 2) {
          displayRefs.push({ name: '', company: '', contact: '' });
        }
        setReferences(displayRefs);
      }

      setHealthData({
        bloodGroup: data.healthDetails?.bloodGroup || '',
        height: data.healthDetails?.height || '',
        weight: data.healthDetails?.weight || '',
        medicalNotes: data.healthDetails?.medicalNotes || ''
      });

      setDeclarationData({
        hasCriminalRecord: data.declaration?.hasCriminalRecord || false,
        criminalDetails: data.declaration?.criminalDetails || '',
        accepted: data.declaration?.accepted || false
      });
    } catch (err) {
      console.error("Error fetching onboarding details:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/onboarding/documents/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  const handleSave = async (status: string = 'In Progress') => {
    setSaving(true);
    try {
      const token = localStorage.getItem("admin_token");
      const body = {
        personalDetails: personalData,
        religion: personalData.religion,
        workExperience: workExperiences.filter(exp => exp.organizationName || exp.designation),
        familyBackground: familyData,
        bankDetails: bankData,
        references: references.filter(r => r.name || r.company || r.contact),
        healthDetails: {
          bloodGroup: healthData.bloodGroup,
          height: healthData.height ? Number(healthData.height) : undefined,
          weight: healthData.weight ? Number(healthData.weight) : undefined,
          medicalNotes: healthData.medicalNotes
        },
        declaration: {
          hasCriminalRecord: declarationData.hasCriminalRecord,
          criminalDetails: declarationData.criminalDetails,
          accepted: declarationData.accepted
        },
        onboardingStatus: status
      };
      
      const res = await fetch(`${API_BASE}/employees/${params.id}/onboarding`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        const updated = await res.json();
        setEmployee(updated);
        alert(`Onboarding ${status === 'Completed' ? 'Submitted' : 'Saved as Draft'} successfully!`);
      } else {
        const error = await res.json();
        alert(`Error: ${error.message || 'Failed to save data'}`);
      }
    } catch (err) {
      console.error("Error saving onboarding data:", err);
      alert("An unexpected error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);
    formData.append('employeeId', params.id as string);

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/onboarding/upload?empId=${employee?.employeeId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        fetchDocuments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/onboarding/documents/${docId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchDocuments();
      } else {
        const error = await res.json();
        alert(`Error: ${error.message || 'Failed to delete document'}`);
      }
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("An unexpected error occurred while deleting.");
    }
  };

  const handlePhotoUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Photo must be under 2MB.'); return; }
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) { alert('Only JPG and PNG files are allowed.'); return; }
    setPhotoUploading(true);
    const formData = new FormData();
    formData.append('photo', file);
    try {
      const token = localStorage.getItem('admin_token');
      const namePrefix = (employee?.fullName || 'emp').replace(/[^a-zA-Z]/g,'').toLowerCase().substring(0,3);
      const res = await fetch(
        `${API_BASE}/onboarding/photo/${params.id}?empId=${employee?.employeeId}&name=${namePrefix}`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData }
      );
      const data = await res.json();
      if (res.ok) {
        setPhotoUrl(data.photoUrl);
        setEmployee((prev: any) => ({ ...prev, photoUrl: data.photoUrl }));
      } else {
        alert(data.message || 'Photo upload failed.');
      }
    } catch (err) { console.error(err); alert('Error uploading photo.'); }
    finally { setPhotoUploading(false); }
  };

  const calculateTotalExperience = () => {
    let totalMonths = 0;
    workExperiences.forEach(exp => {
      if (!exp.startDate) return;
      const start = new Date(exp.startDate);
      const end = exp.isCurrent ? new Date() : (exp.endDate ? new Date(exp.endDate) : new Date());
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      totalMonths += Math.max(0, months);
    });
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    return { years, months, total: `${years}.${months} Years` };
  };

  const calculateProgress = () => {
    if (!employee) return 0;
    let fields = [
      personalData.dob, personalData.gender, 
      personalData.currentAddress.line1, personalData.currentAddress.city, personalData.currentAddress.state, personalData.currentAddress.pincode,
      personalData.aadhaarNumber, personalData.panNumber,
      workExperiences[0]?.organizationName,
      familyData.fatherName, familyData.maritalStatus, familyData.emergencyContactNumber,
      bankData.bankName, bankData.accountNumber, bankData.ifscCode, bankData.bankAddress
    ];
    let filled = fields.filter(f => f && String(f).length > 0).length;
    let docCount = documents.length;
    let progress = Math.min(100, Math.round(((filled + docCount) / (fields.length + 5)) * 100));
    return progress;
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin inline text-zinc-400" size={40} /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-6">
          <button onClick={() => router.back()} className="p-3 hover:bg-zinc-100 rounded-2xl text-zinc-400 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-zinc-200 bg-zinc-100 flex items-center justify-center flex-shrink-0">
            {photoUrl ? (
              <img
                src={`${API_BASE.replace('/api', '')}${photoUrl}`}
                alt={employee?.fullName}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as any).style.display = 'none'; }}
              />
            ) : (
              <span className="text-lg font-black text-zinc-400">
                {employee?.fullName?.charAt(0)?.toUpperCase() || <User size={24} />}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{employee?.fullName}</h1>
            <p className="text-sm text-zinc-500 font-sans">
              ID: <span className="font-mono font-bold text-primary">{employee?.employeeId}</span> • {employee?.designation}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-4">
             <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
               employee?.onboardingStatus === 'Completed' ? 'bg-emerald-100 text-emerald-600' :
               employee?.onboardingStatus === 'In Progress' ? 'bg-amber-100 text-amber-600' :
               'bg-zinc-100 text-zinc-600'
             }`}>
               Status: {employee?.onboardingStatus}
             </span>
             <div className="w-32 h-2 bg-zinc-100 rounded-full overflow-hidden">
               <div className="h-full bg-primary transition-all duration-500" style={{ width: `${calculateProgress()}%` }} />
             </div>
             <span className="text-xs font-bold text-zinc-400">{calculateProgress()}%</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleSave('In Progress')}
              disabled={saving}
              className="px-6 py-2 rounded-xl text-sm font-bold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-all flex items-center gap-2"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save as Draft
            </button>
            <button 
              onClick={() => handleSave('Completed')}
              disabled={saving}
              className="px-6 py-2 rounded-xl text-sm font-bold bg-zinc-900 text-white hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-lg shadow-zinc-200"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />} Submit Onboarding
            </button>
          </div>
        </div>
      </div>
      
      {/* (Grid start) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                activeTab === tab.id 
                  ? "bg-zinc-900 text-white shadow-xl shadow-zinc-200" 
                  : "bg-white border border-zinc-200 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600"
              }`}
            >
              <tab.icon size={20} />
              <span className="font-bold text-sm">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-white border border-zinc-200 rounded-[2.5rem] p-10 shadow-sm animate-in fade-in duration-300">
          {activeTab === 'personal' && (
            <div className="space-y-8">
              <h3 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-4">Personal Details</h3>

              {/* === Photo Upload Widget === */}
              <div className="flex items-start gap-8 p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100">
                {/* Preview */}
                <div className="flex-shrink-0">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-zinc-200 bg-white flex items-center justify-center">
                    {photoUrl ? (
                      <img
                        src={`${API_BASE.replace('/api','')}/uploads/${employee?.employeeId}/photos/${photoUrl.split('/').pop()}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as any).style.display='none'; }}
                      />
                    ) : (
                      <User size={40} className="text-zinc-300" />
                    )}
                  </div>
                  {photoUrl && (
                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500 text-center mt-2">✓ Uploaded</p>
                  )}
                </div>

                {/* Upload area */}
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Upload Photograph</p>
                    <p className="text-xs text-zinc-500">JPG or PNG · Max 2MB · Rename: first3letters-EmpID</p>
                  </div>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setPhotoDragOver(true); }}
                    onDragLeave={() => setPhotoDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault(); setPhotoDragOver(false);
                      const f = e.dataTransfer.files?.[0];
                      if (f) handlePhotoUpload(f);
                    }}
                    className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                      photoDragOver ? 'border-primary bg-primary/5' : 'border-zinc-200 hover:border-primary hover:bg-zinc-50'
                    }`}
                  >
                    <input
                      type="file" accept="image/jpeg,image/png"
                      className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f); }}
                    />
                    {photoUploading ? (
                      <div className="flex items-center justify-center gap-2 text-zinc-400">
                        <Loader2 size={18} className="animate-spin" /> <span className="text-xs font-bold">Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-zinc-400">
                        <Upload size={22} />
                        <span className="text-xs font-bold">{photoUrl ? 'Replace Photo' : 'Drag & drop or click to upload'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* === End Photo Widget === */}

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Date of Birth</label>
                  <input type="date" value={personalData.dob} onChange={e => setPersonalData({...personalData, dob: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Gender</label>
                  <select value={personalData.gender} onChange={e => setPersonalData({...personalData, gender: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Religion</label>
                  <select 
                    value={personalData.religion} 
                    onChange={e => setPersonalData({...personalData, religion: e.target.value})} 
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none"
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
                {/* Current Address */}
                <div className="col-span-2 space-y-6 bg-zinc-50 p-6 rounded-[2rem] border border-zinc-100">
                  <h4 className="text-sm font-bold text-zinc-900">Current Address</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Address Line 1 (Street / House No.)</label>
                      <input type="text" value={personalData.currentAddress.line1} onChange={e => setPersonalData({...personalData, currentAddress: {...personalData.currentAddress, line1: e.target.value}})} className="w-full bg-white border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="Flat No / House No, Building Name" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Address Line 2 (Area / Landmark)</label>
                      <input type="text" value={personalData.currentAddress.line2} onChange={e => setPersonalData({...personalData, currentAddress: {...personalData.currentAddress, line2: e.target.value}})} className="w-full bg-white border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="Street, Locality, Landmark" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">City</label>
                      <input type="text" value={personalData.currentAddress.city} onChange={e => setPersonalData({...personalData, currentAddress: {...personalData.currentAddress, city: e.target.value}})} className="w-full bg-white border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="Enter City" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">State</label>
                      <input type="text" value={personalData.currentAddress.state} onChange={e => setPersonalData({...personalData, currentAddress: {...personalData.currentAddress, state: e.target.value}})} className="w-full bg-white border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="Enter State" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Country</label>
                      <select value={personalData.currentAddress.country} onChange={e => setPersonalData({...personalData, currentAddress: {...personalData.currentAddress, country: e.target.value}})} className="w-full bg-white border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none">
                        <option value="India">India</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">PIN Code</label>
                      <input type="text" maxLength={6} value={personalData.currentAddress.pincode} onChange={e => setPersonalData({...personalData, currentAddress: {...personalData.currentAddress, pincode: e.target.value.replace(/\D/g, '')}})} className="w-full bg-white border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="6-digit PIN" />
                    </div>
                  </div>
                </div>

                {/* Permanent Address */}
                <div className="col-span-2 space-y-6 bg-zinc-50 p-6 rounded-[2rem] border border-zinc-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-zinc-900">Permanent Address</h4>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" checked={sameAsCurrent} onChange={e => setSameAsCurrent(e.target.checked)} className="w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary" />
                      <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-900 transition-colors">Same as Current Address</span>
                    </label>
                  </div>
                  
                  {!sameAsCurrent && (
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Address Line 1 (Street / House No.)</label>
                        <input type="text" value={personalData.permanentAddress.line1} onChange={e => setPersonalData({...personalData, permanentAddress: {...personalData.permanentAddress, line1: e.target.value}})} className="w-full bg-white border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="Flat No / House No, Building Name" />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Address Line 2 (Area / Landmark)</label>
                        <input type="text" value={personalData.permanentAddress.line2} onChange={e => setPersonalData({...personalData, permanentAddress: {...personalData.permanentAddress, line2: e.target.value}})} className="w-full bg-white border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="Street, Locality, Landmark" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">City</label>
                        <input type="text" value={personalData.permanentAddress.city} onChange={e => setPersonalData({...personalData, permanentAddress: {...personalData.permanentAddress, city: e.target.value}})} className="w-full bg-white border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="Enter City" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">State</label>
                        <input type="text" value={personalData.permanentAddress.state} onChange={e => setPersonalData({...personalData, permanentAddress: {...personalData.permanentAddress, state: e.target.value}})} className="w-full bg-white border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="Enter State" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Country</label>
                        <select value={personalData.permanentAddress.country} onChange={e => setPersonalData({...personalData, permanentAddress: {...permanentAddress, country: e.target.value}})} className="w-full bg-white border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none">
                          <option value="India">India</option>
                          <option value="USA">USA</option>
                          <option value="UK">UK</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">PIN Code</label>
                        <input type="text" maxLength={6} value={personalData.permanentAddress.pincode} onChange={e => setPersonalData({...personalData, permanentAddress: {...permanentAddress, pincode: e.target.value.replace(/\D/g, '')}})} className="w-full bg-white border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="6-digit PIN" />
                      </div>
                    </div>
                  )}
                  {sameAsCurrent && (
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                      <p className="text-xs font-medium text-primary flex items-center gap-2">
                        <CheckCircle size={14} /> Permanent address is synced with current address.
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Aadhaar Number</label>
                  <input type="text" value={personalData.aadhaarNumber} onChange={e => setPersonalData({...personalData, aadhaarNumber: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="1234 5678 9012" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">PAN Number</label>
                  <input type="text" value={personalData.panNumber} onChange={e => setPersonalData({...personalData, panNumber: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="ABCDE1234F" />
                </div>
              </div>

              {/* ===== Health & Declaration ===== */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-base">🩺</div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-zinc-700">Health & Declaration</h4>
                </div>

                {/* Health fields */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Blood Group <span className="text-rose-400">*</span></label>
                    <select value={healthData.bloodGroup} onChange={e => setHealthData({...healthData, bloodGroup: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none">
                      <option value="">Select Blood Group</option>
                      {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>

                  {/* BMI Block */}
                  <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 flex flex-col justify-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">BMI (Auto-calculated)</p>
                    {healthData.height && healthData.weight ? (
                      <>
                        <p className="text-2xl font-black text-zinc-900">
                          {(Number(healthData.weight) / Math.pow(Number(healthData.height) / 100, 2)).toFixed(1)}
                        </p>
                        <p className="text-[10px] text-zinc-400">
                          {(() => {
                            const bmi = Number(healthData.weight) / Math.pow(Number(healthData.height) / 100, 2);
                            if (bmi < 18.5) return '⚠️ Underweight';
                            if (bmi < 25) return '✅ Normal';
                            if (bmi < 30) return '⚠️ Overweight';
                            return '🔴 Obese';
                          })()}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-zinc-300">Enter height & weight</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Height (cm)</label>
                    <input type="number" min={100} max={250} value={healthData.height} onChange={e => setHealthData({...healthData, height: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="170" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Weight (kg)</label>
                    <input type="number" min={30} max={200} value={healthData.weight} onChange={e => setHealthData({...healthData, weight: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="65" />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Medical Information</label>
                    <p className="text-xs text-zinc-400">Do you have any medical conditions, allergies, or health concerns we should be aware of?</p>
                    <textarea rows={3} value={healthData.medicalNotes} onChange={e => setHealthData({...healthData, medicalNotes: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none resize-none" placeholder="e.g. Diabetic, allergic to penicillin, asthma..." />
                  </div>
                </div>

                {/* Criminal Record Declaration */}
                <div className="space-y-4 p-6 bg-amber-50 border border-amber-100 rounded-[2rem]">
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">⚖️ Legal Declaration</p>
                  <p className="text-xs text-zinc-600 font-medium">Does the candidate have any criminal record or pending legal cases?</p>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="admin_criminal" value="false" checked={!declarationData.hasCriminalRecord} onChange={() => setDeclarationData({...declarationData, hasCriminalRecord: false, criminalDetails: ''})} className="text-primary" />
                      <span className="text-sm font-bold text-zinc-700">No</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="admin_criminal" value="true" checked={declarationData.hasCriminalRecord} onChange={() => setDeclarationData({...declarationData, hasCriminalRecord: true})} className="text-primary" />
                      <span className="text-sm font-bold text-zinc-700">Yes</span>
                    </label>
                  </div>
                  {declarationData.hasCriminalRecord && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                      <textarea rows={3} value={declarationData.criminalDetails} onChange={e => setDeclarationData({...declarationData, criminalDetails: e.target.value})} className="w-full bg-white border border-amber-200 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-amber-400 outline-none resize-none" placeholder="Please provide details of the case..." />
                    </div>
                  )}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" checked={declarationData.accepted} onChange={e => setDeclarationData({...declarationData, accepted: e.target.checked})} className="mt-0.5 w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary" />
                    <span className="text-xs text-zinc-600 leading-relaxed group-hover:text-zinc-900 transition-colors">
                      I confirm the above declaration is accurate and acknowledge that providing false information may result in disciplinary action.
                    </span>
                  </label>
                </div>
              </div>
              {/* ===== End Health & Declaration ===== */}

            </div>
          )}

          {activeTab === 'professional' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <h3 className="text-lg font-bold text-zinc-900">Work Experience</h3>
                <button 
                  onClick={() => setWorkExperiences([...workExperiences, {
                    organizationName: '', designation: '', startDate: '', endDate: '', isCurrent: false, jobResponsibilities: '', contactPersonName: '', contactPersonEmail: '', contactPersonPhone: ''
                  }])}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                >
                  <Plus size={14} /> Add Experience
                </button>
              </div>

              {/* Experience Summary Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-50 p-6 rounded-[2rem] border border-zinc-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Total Experience</p>
                  <p className="text-2xl font-black text-zinc-900">{calculateTotalExperience().years}y {calculateTotalExperience().months}m</p>
                </div>
                <div className="bg-zinc-50 p-6 rounded-[2rem] border border-zinc-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Companies Worked</p>
                  <p className="text-2xl font-black text-zinc-900">{workExperiences.filter(e => e.organizationName).length}</p>
                </div>
                <div className="bg-zinc-50 p-6 rounded-[2rem] border border-zinc-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Current/Last Role</p>
                  <p className="text-sm font-bold text-zinc-900 truncate">
                    {workExperiences[0]?.designation || 'N/A'}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-bold truncate">
                    {workExperiences[0]?.organizationName ? `@ ${workExperiences[0].organizationName}` : 'No records yet'}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {workExperiences.map((exp, idx) => (
                  <div key={idx} className="relative p-8 bg-zinc-50/50 border border-zinc-100 rounded-[2.5rem] space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-400">
                          <Briefcase size={20} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Position {idx + 1}</span>
                          {exp.isCurrent && <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded text-[9px] font-black uppercase tracking-widest">Current</span>}
                        </div>
                      </div>
                      {workExperiences.length > 1 && (
                        <button 
                          onClick={() => {
                            if(confirm("Remove this experience record?")) {
                              setWorkExperiences(workExperiences.filter((_, i) => i !== idx));
                            }
                          }}
                          className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Organization Name *</label>
                        <input 
                          type="text" required value={exp.organizationName} 
                          onChange={e => {
                            const newExps = [...workExperiences];
                            newExps[idx].organizationName = e.target.value;
                            setWorkExperiences(newExps);
                          }} 
                          className="w-full bg-white border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" 
                          placeholder="e.g. Google India"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Designation *</label>
                        <input 
                          type="text" required value={exp.designation} 
                          onChange={e => {
                            const newExps = [...workExperiences];
                            newExps[idx].designation = e.target.value;
                            setWorkExperiences(newExps);
                          }} 
                          className="w-full bg-white border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" 
                          placeholder="e.g. Senior Software Engineer"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Start Date *</label>
                        <input 
                          type="date" required value={exp.startDate} 
                          onChange={e => {
                            const newExps = [...workExperiences];
                            newExps[idx].startDate = e.target.value;
                            setWorkExperiences(newExps);
                          }} 
                          className="w-full bg-white border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" 
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">End Date</label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input 
                              type="checkbox" checked={exp.isCurrent} 
                              onChange={e => {
                                const newExps = [...workExperiences];
                                newExps[idx].isCurrent = e.target.checked;
                                if(e.target.checked) newExps[idx].endDate = '';
                                setWorkExperiences(newExps);
                              }}
                              className="w-3 h-3 rounded text-primary"
                            />
                            <span className="text-[10px] font-bold text-zinc-500">Currently Working</span>
                          </label>
                        </div>
                        <input 
                          type="date" disabled={exp.isCurrent} value={exp.endDate} 
                          onChange={e => {
                            const newExps = [...workExperiences];
                            newExps[idx].endDate = e.target.value;
                            setWorkExperiences(newExps);
                          }} 
                          className={`w-full bg-white border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none ${exp.isCurrent ? 'opacity-50' : ''}`} 
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Job Responsibilities</label>
                        <textarea 
                          rows={3} value={exp.jobResponsibilities} 
                          onChange={e => {
                            const newExps = [...workExperiences];
                            newExps[idx].jobResponsibilities = e.target.value;
                            setWorkExperiences(newExps);
                          }} 
                          className="w-full bg-white border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none resize-none" 
                          placeholder="Briefly describe your role and achievements..."
                        />
                      </div>

                      {/* Verification Contact */}
                      <div className="col-span-2 pt-4">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-[1px] flex-grow bg-zinc-100"></div>
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-300">Verification Contact</span>
                          <div className="h-[1px] flex-grow bg-zinc-100"></div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-zinc-400">Contact Name</label>
                            <input 
                              type="text" value={exp.contactPersonName} 
                              onChange={e => {
                                const newExps = [...workExperiences];
                                newExps[idx].contactPersonName = e.target.value;
                                setWorkExperiences(newExps);
                              }}
                              className="w-full bg-white/50 border border-zinc-100 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary outline-none" 
                              placeholder="Reporting Manager"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-zinc-400">Contact Email</label>
                            <input 
                              type="email" value={exp.contactPersonEmail} 
                              onChange={e => {
                                const newExps = [...workExperiences];
                                newExps[idx].contactPersonEmail = e.target.value;
                                setWorkExperiences(newExps);
                              }}
                              className="w-full bg-white/50 border border-zinc-100 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary outline-none" 
                              placeholder="manager@company.com"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-zinc-400">Contact Phone</label>
                            <input 
                              type="text" value={exp.contactPersonPhone} 
                              onChange={e => {
                                const newExps = [...workExperiences];
                                newExps[idx].contactPersonPhone = e.target.value;
                                setWorkExperiences(newExps);
                              }}
                              className="w-full bg-white/50 border border-zinc-100 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-primary outline-none" 
                              placeholder="+91..."
                            />
                          </div>
                        </div>
                        <p className="text-[9px] text-zinc-400 mt-3 italic flex items-center gap-1">
                          <CheckCircle size={10} className="text-zinc-300" /> Ensure you have obtained consent before sharing contact details for verification.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'family' && (
            <div className="space-y-8">
              <h3 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-4">Family Background</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Father's Name</label>
                  <input type="text" value={familyData.fatherName} onChange={e => setFamilyData({...familyData, fatherName: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="As per official records" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Mother's Name</label>
                  <input type="text" value={familyData.motherName} onChange={e => setFamilyData({...familyData, motherName: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="As per official records" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Marital Status</label>
                  <select value={familyData.maritalStatus} onChange={e => setFamilyData({...familyData, maritalStatus: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none">
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Spouse Name (if applicable)</label>
                  <input type="text" value={familyData.spouseName} onChange={e => setFamilyData({...familyData, spouseName: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="If applicable" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Emergency Contact Name</label>
                  <input type="text" value={familyData.emergencyContactName} onChange={e => setFamilyData({...familyData, emergencyContactName: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="Full name of contact" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Emergency Contact Number</label>
                  <input type="text" value={familyData.emergencyContactNumber} onChange={e => setFamilyData({...familyData, emergencyContactNumber: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="10-digit mobile number" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bank' && (
            <div className="space-y-8">
              <h3 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-4">Bank Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Account Holder Name</label>
                  <input type="text" value={bankData.accountHolderName} onChange={e => setBankData({...bankData, accountHolderName: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="Name as per bank records" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Bank Name</label>
                  <input type="text" value={bankData.bankName} onChange={e => setBankData({...bankData, bankName: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="Full Bank Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Account Number</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={bankData.accountNumber} 
                      onChange={e => setBankData({...bankData, accountNumber: e.target.value.replace(/\D/g, '')})} 
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none font-mono" 
                      placeholder="xxxxxxxxxx" 
                    />
                    {bankData.accountNumber.length > 4 && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-300 pointer-events-none">
                        {"*".repeat(bankData.accountNumber.length - 4)}{bankData.accountNumber.slice(-4)}
                      </div>
                    )}
                  </div>
                  {bankData.accountNumber && (bankData.accountNumber.length < 9 || bankData.accountNumber.length > 18) && (
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Must be 9-18 digits</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">IFSC Code</label>
                  <input type="text" value={bankData.ifscCode} onChange={e => setBankData({...bankData, ifscCode: e.target.value.toUpperCase()})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none font-mono" placeholder="xxxxxxxx" maxLength={11} />
                  {bankData.ifscCode && bankData.ifscCode.length !== 11 && (
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Must be 11 characters</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Account Type</label>
                  <select value={bankData.accountType} onChange={e => setBankData({...bankData, accountType: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none">
                    <option value="">Select Account Type</option>
                    <option value="Savings">Savings</option>
                    <option value="Current">Current</option>
                  </select>
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Bank Address</label>
                  <textarea rows={3} value={bankData.bankAddress} onChange={e => setBankData({...bankData, bankAddress: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none resize-none" placeholder="Bank address" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">MMID (Optional)</label>
                  <input type="text" value={bankData.mmid} onChange={e => setBankData({...bankData, mmid: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="xxxxxxx" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">VPA / UPI ID (Optional)</label>
                  <input type="text" value={bankData.vpa} onChange={e => setBankData({...bankData, vpa: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="xxxxxx@xxx" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'references' && (
            <div className="space-y-8">
              <h3 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-4">References</h3>
              {references.map((ref, idx) => (
                <div key={idx} className="p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Reference {idx + 1}</span>
                    {idx > 1 && (
                      <button onClick={() => setReferences(references.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Name</label>
                      <input type="text" value={ref.name} onChange={e => {
                        const newRefs = [...references];
                        newRefs[idx].name = e.target.value;
                        setReferences(newRefs);
                      }} className="w-full bg-white border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="Full Name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Company</label>
                      <input type="text" value={ref.company} onChange={e => {
                        const newRefs = [...references];
                        newRefs[idx].company = e.target.value;
                        setReferences(newRefs);
                      }} className="w-full bg-white border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="Company Name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Contact</label>
                      <input type="text" value={ref.contact} onChange={e => {
                        const newRefs = [...references];
                        newRefs[idx].contact = e.target.value;
                        setReferences(newRefs);
                      }} className="w-full bg-white border border-zinc-100 rounded-2xl py-3 px-4 text-sm focus:ring-1 focus:ring-primary outline-none" placeholder="Email or Mobile Number" />
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => setReferences([...references, { name: '', company: '', contact: '' }])}
                className="flex items-center gap-2 text-primary font-bold text-sm hover:underline"
              >
                <Plus size={16} /> Add Another Reference
              </button>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-8">
              <h3 className="text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-4">Document Upload</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  'Resume', 'Experience Certificates', 'Educational Certificates', 
                  'ID Proof', 'Offer Letter', 'NDA'
                ].map(docType => {
                  const existingDocs = documents.filter(d => d.type === docType);
                  const isMulti = ['Experience Certificates', 'Educational Certificates', 'ID Proof'].includes(docType);
                  const canUploadMore = isMulti || existingDocs.length === 0;

                  return (
                    <div key={docType} className="p-6 border border-zinc-200 rounded-[2rem] space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-zinc-700">{docType}</span>
                        <div className="flex gap-2">
                          {isMulti && <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-1 rounded-lg">Multi-Upload</span>}
                          {existingDocs.length > 0 ? (
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">{existingDocs.length} Uploaded</span>
                          ) : (
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-100 px-2 py-1 rounded-lg">Required</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {existingDocs.map(doc => (
                          <div key={doc._id} className="flex items-center gap-2 p-2 bg-zinc-50 rounded-xl border border-zinc-100 group/item hover:bg-white transition-all">
                            <a 
                              href={`${API_BASE.replace('/api', '')}${doc.url}`} 
                              target="_blank" 
                              className="flex-grow flex items-center gap-2 text-[11px] font-medium text-zinc-600 truncate"
                            >
                              <FileText size={12} className="text-zinc-400" />
                              <span className="truncate">{doc.name || 'View Document'}</span>
                            </a>
                            <button 
                              onClick={() => handleDeleteDocument(doc._id)}
                              className="p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete Document"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {canUploadMore && (
                        <div className="relative group">
                          <input 
                            type="file" 
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            onChange={e => handleFileUpload(e, docType)}
                          />
                          <div className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-400 group-hover:border-primary group-hover:text-primary transition-all">
                            <Upload size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Upload {existingDocs.length > 0 ? 'Another' : 'File'}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

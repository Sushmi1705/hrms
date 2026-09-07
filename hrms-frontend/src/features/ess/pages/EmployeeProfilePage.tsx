import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Building, Calendar, 
  Briefcase, HeartPulse, Shield, Plus, Trash2, Edit3, 
  CheckCircle2, AlertCircle, Clock, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { essApi } from '../api/essApi';
import { EmployeeProfileData, EmergencyContact } from '../types/ess';

export const EmployeeProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<EmployeeProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'personal' | 'employment' | 'contacts' | 'changes'>('personal');

  // Contact Modal
  const [showContactModal, setShowContactModal] = useState(false);
  const [cName, setCName] = useState('');
  const [cRelationship, setCRelationship] = useState('Spouse');
  const [cPhone, setCPhone] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cAddress, setCAddress] = useState('');
  const [cIsPrimary, setCIsPrimary] = useState(false);
  const [savingContact, setSavingContact] = useState(false);

  // Change Request Modal
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [changeField, setChangeField] = useState('Legal Name');
  const [proposedVal, setProposedVal] = useState('');
  const [changeReason, setChangeReason] = useState('');
  const [submittingChange, setSubmittingChange] = useState(false);

  const fetchProfile = () => {
    setLoading(true);
    essApi.getProfile()
      .then(res => setProfile(res))
      .catch(err => {
        console.error(err);
        toast.error('Failed to load profile');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName || !cPhone) {
      toast.error('Please fill in required contact fields');
      return;
    }
    setSavingContact(true);
    try {
      await essApi.createEmergencyContact({
        name: cName,
        relationship: cRelationship,
        phoneNumber: cPhone,
        email: cEmail,
        address: cAddress,
        isPrimary: cIsPrimary
      });
      toast.success('Emergency contact added successfully');
      setShowContactModal(false);
      setCName('');
      setCPhone('');
      setCEmail('');
      setCAddress('');
      fetchProfile();
    } catch (err: any) {
      toast.error('Failed to save emergency contact');
    } finally {
      setSavingContact(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this emergency contact?')) return;
    try {
      await essApi.deleteEmergencyContact(id);
      toast.success('Contact deleted');
      fetchProfile();
    } catch (err) {
      toast.error('Failed to delete contact');
    }
  };

  const handleSubmitChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposedVal.trim() || !changeReason.trim()) {
      toast.error('Please specify the new proposed value and justification reason');
      return;
    }
    setSubmittingChange(true);
    try {
      await essApi.submitProfileChangeRequest({
        fieldName: changeField,
        proposedValue: proposedVal,
        reason: changeReason
      });
      toast.success('Profile change request submitted for HR approval');
      setShowChangeModal(false);
      setProposedVal('');
      setChangeReason('');
      fetchProfile();
    } catch (err) {
      toast.error('Failed to submit change request');
    } finally {
      setSubmittingChange(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-48 rounded-3xl" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img 
              src={profile.avatarUrl} 
              alt={profile.fullName} 
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900 bg-indigo-50/40 p-1"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-200">
                  {profile.employeeNumber}
                </Badge>
                <Badge variant="outline" className="text-emerald-700 dark:text-emerald-400 border-emerald-300">
                  {profile.status}
                </Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                {profile.fullName}
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-0.5">
                {profile.designationTitle} • {profile.departmentName}
              </p>
            </div>
          </div>

          <Button 
            onClick={() => setShowChangeModal(true)}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Request Profile Change
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
          <Button
            variant={activeTab === 'personal' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('personal')}
            className="rounded-xl text-xs"
          >
            <User className="w-3.5 h-3.5 mr-1.5" />
            Personal Details
          </Button>
          <Button
            variant={activeTab === 'employment' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('employment')}
            className="rounded-xl text-xs"
          >
            <Briefcase className="w-3.5 h-3.5 mr-1.5" />
            Employment & Org
          </Button>
          <Button
            variant={activeTab === 'contacts' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('contacts')}
            className="rounded-xl text-xs"
          >
            <HeartPulse className="w-3.5 h-3.5 mr-1.5" />
            Emergency Contacts ({profile.emergencyContacts?.length || 0})
          </Button>
          <Button
            variant={activeTab === 'changes' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('changes')}
            className="rounded-xl text-xs"
          >
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            Change Requests ({profile.pendingChangeRequests?.length || 0})
          </Button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'personal' && (
        <Card className="rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Personal & Contact Information</CardTitle>
            <CardDescription className="text-xs">Your verified personnel record on file</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 font-medium">Work Email</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-500" />
                  {profile.workEmail}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 font-medium">Personal Email</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                  {profile.personalEmail}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 font-medium">Mobile Phone</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  {profile.phoneNumber}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 font-medium">Residential Address</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  {profile.address}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 font-medium">Date of Birth</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  {new Date(profile.dateOfBirth).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 font-medium">Nationality & Marital Status</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                  {profile.nationality} • {profile.maritalStatus}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'employment' && (
        <Card className="rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Employment & Reporting Hierarchy</CardTitle>
            <CardDescription className="text-xs">Corporate organization structure and tenure</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 font-medium">Department</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                  <Building className="w-4 h-4 text-indigo-500" />
                  {profile.departmentName}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 font-medium">Job Designation</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                  {profile.designationTitle}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 font-medium">Work Location / Branch</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                  {profile.branchName} ({profile.workLocation})
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 font-medium">Date of Joining</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                  {new Date(profile.joiningDate).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 font-medium">Reporting Line Manager</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm">
                    {profile.managerName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{profile.managerName}</p>
                    <p className="text-xs text-slate-500">{profile.managerDesignation} • {profile.managerEmail}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 font-medium">Employment Contract</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                  {profile.employmentType}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'contacts' && (
        <Card className="rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Emergency Contacts</CardTitle>
              <CardDescription className="text-xs">Individuals to reach in emergency situations</CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowContactModal(true)} className="rounded-xl">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Contact
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.emergencyContacts?.map(contact => (
                <div key={contact.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{contact.name}</p>
                      <Badge variant="outline" className="text-[10px] border-slate-300">
                        {contact.relationship}
                      </Badge>
                      {contact.isPrimary && (
                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px]">
                          Primary
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {contact.phoneNumber}
                    </p>
                    {contact.email && (
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {contact.email}
                      </p>
                    )}
                    {contact.address && (
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {contact.address}
                      </p>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteContact(contact.id)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'changes' && (
        <Card className="rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Profile Change Request History</CardTitle>
            <CardDescription className="text-xs">Audit log of submitted adjustments to locked fields</CardDescription>
          </CardHeader>
          <CardContent>
            {profile.pendingChangeRequests?.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">No profile change requests filed.</p>
            ) : (
              <div className="space-y-3">
                {profile.pendingChangeRequests?.map(req => (
                  <div key={req.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{req.fieldName}</p>
                        <Badge className={
                          req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                          req.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }>
                          {req.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">Proposed Value: <span className="font-semibold text-slate-700 dark:text-slate-300">{req.proposedValue}</span></p>
                      <p className="text-xs text-slate-400 mt-0.5">Reason: {req.reason}</p>
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* MODAL: ADD EMERGENCY CONTACT */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Emergency Contact</h3>
            <form onSubmit={handleCreateContact} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Full Name *</label>
                <input 
                  type="text" 
                  value={cName} 
                  onChange={e => setCName(e.target.value)} 
                  required
                  placeholder="e.g. Eleanor Vance"
                  className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Relationship *</label>
                  <select 
                    value={cRelationship} 
                    onChange={e => setCRelationship(e.target.value)}
                    className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Partner">Partner</option>
                    <option value="Child">Child</option>
                    <option value="Friend">Friend</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Phone Number *</label>
                  <input 
                    type="tel" 
                    value={cPhone} 
                    onChange={e => setCPhone(e.target.value)} 
                    required
                    placeholder="+1 (555) 000-0000"
                    className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Email Address</label>
                <input 
                  type="email" 
                  value={cEmail} 
                  onChange={e => setCEmail(e.target.value)} 
                  placeholder="name@example.com"
                  className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Residential Address</label>
                <input 
                  type="text" 
                  value={cAddress} 
                  onChange={e => setCAddress(e.target.value)} 
                  placeholder="Street, City, State"
                  className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input 
                  type="checkbox" 
                  id="primaryContact" 
                  checked={cIsPrimary} 
                  onChange={e => setCIsPrimary(e.target.checked)} 
                  className="rounded text-indigo-600"
                />
                <label htmlFor="primaryContact" className="text-xs text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                  Mark as primary emergency contact
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setShowContactModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={savingContact} className="bg-indigo-600 text-white">
                  Save Contact
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT PROFILE CHANGE REQUEST */}
      {showChangeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Request Profile Modification</h3>
            <p className="text-xs text-slate-500">
              Changes to legal name, marital status, or core identifiers require HR People Operations verification.
            </p>
            <form onSubmit={handleSubmitChangeRequest} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Target Field</label>
                <select 
                  value={changeField} 
                  onChange={e => setChangeField(e.target.value)}
                  className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                >
                  <option value="Legal Full Name">Legal Full Name</option>
                  <option value="Marital Status">Marital Status</option>
                  <option value="Residential Address">Residential Address</option>
                  <option value="Bank Account & Routing">Bank Account & Routing Number</option>
                  <option value="Tax Withholding Classification">Tax Withholding Classification</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Proposed New Value *</label>
                <input 
                  type="text" 
                  value={proposedVal} 
                  onChange={e => setProposedVal(e.target.value)} 
                  required
                  placeholder="Enter exact updated info"
                  className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Reason / Justification *</label>
                <textarea 
                  value={changeReason} 
                  onChange={e => setChangeReason(e.target.value)} 
                  required
                  rows={3}
                  placeholder="Provide rationale for HR documentation"
                  className="w-full mt-1 p-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setShowChangeModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submittingChange} className="bg-indigo-600 text-white">
                  <Send className="w-4 h-4 mr-1.5" />
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

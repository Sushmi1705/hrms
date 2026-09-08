import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { toast } from 'sonner';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import { 
  User, Briefcase, Mail, Calendar, Loader2, CheckCircle2, ChevronRight,
  Shield, Building, MapPin, GraduationCap, Award, CreditCard, FileText, Check, Plus, UploadCloud
} from 'lucide-react';
import { cn } from '@/lib/utils';

const WIZARD_STEPS = [
  { id: 'basic', label: 'Basic Information', icon: User },
  { id: 'employment', label: 'Employment', icon: Briefcase },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'organization', label: 'Organization', icon: Building },
  { id: 'address', label: 'Address', icon: MapPin },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'experience', label: 'Experience', icon: Award },
  { id: 'bank', label: 'Bank', icon: CreditCard },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'review', label: 'Review', icon: CheckCircle2 }
];

export function EmployeeFormDrawer({ open, onOpenChange, employeeToEdit }: any) {
  const queryClient = useQueryClient();
  const isEditing = !!employeeToEdit;
  const [isSaving, setIsSaving] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', 
    joiningDate: new Date().toISOString().split('T')[0],
    departmentId: '00000000-0000-0000-0000-000000000000',
    designationId: '00000000-0000-0000-0000-000000000000',
    branchId: '00000000-0000-0000-0000-000000000000',
    status: 'Active'
  });

  useEffect(() => {
    if (open) setActiveStepIndex(0);
    if (employeeToEdit) {
      setFormData({
        ...employeeToEdit,
        joiningDate: employeeToEdit.joiningDate ? new Date(employeeToEdit.joiningDate).toISOString().split('T')[0] : ''
      });
    } else {
      setFormData({
        firstName: '', lastName: '', email: '', 
        joiningDate: new Date().toISOString().split('T')[0],
        departmentId: '00000000-0000-0000-0000-000000000000',
        designationId: '00000000-0000-0000-0000-000000000000',
        branchId: '00000000-0000-0000-0000-000000000000',
        status: 'Active'
      });
    }
  }, [employeeToEdit, open]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (activeStepIndex < 9) {
      setActiveStepIndex(prev => prev + 1);
      return;
    }
    
    setIsSaving(true);
    try {
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/api/v1/Employees/` + employeeToEdit.id, { id: employeeToEdit.id, ...formData });
        toast.success("Employee updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/api/v1/Employees`, formData);
        toast.success("Employee created successfully");
      }
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      onOpenChange(false);
    } catch (err) {
      toast.error("Failed to save employee. Is the backend running?");
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepContent = () => {
    switch(activeStepIndex) {
      case 0:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Basic Information</h3>
              <p className="text-sm text-slate-500">Enter the core identity details of the employee.</p>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>First Name <span className="text-red-500">*</span></Label>
                <Input required placeholder="John" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="h-10" />
              </div>
              <div className="space-y-2">
                <Label>Last Name <span className="text-red-500">*</span></Label>
                <Input required placeholder="Doe" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="h-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Primary Email <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input className="pl-9 h-10" required type="email" placeholder="john.doe@company.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Employment Details</h3>
              <p className="text-sm text-slate-500">Configure job role, dates, and status.</p>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Joining Date <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input className="pl-9 h-10" required type="date" value={formData.joiningDate} onChange={e => setFormData({...formData, joiningDate: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="h-10">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="OnLeave">On Leave</option>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Employee Type</Label>
              <Select className="h-10">
                <option value="FullTime">Full Time</option>
                <option value="PartTime">Part Time</option>
                <option value="Contract">Contract</option>
              </Select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Contact Information</h3>
              <p className="text-sm text-slate-500">Phone numbers and emergency contacts.</p>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Personal Phone</Label>
                <Input placeholder="+1 (555) 123-4567" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label>Work Phone</Label>
                <Input placeholder="+1 (555) 987-6543" className="h-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Emergency Contact Name</Label>
              <Input placeholder="Jane Doe" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label>Emergency Contact Phone</Label>
              <Input placeholder="+1 (555) 000-0000" className="h-10" />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Organization Structure</h3>
              <p className="text-sm text-slate-500">Assign to departments, branches, and cost centers.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Select className="h-10">
                  <option value="dept-1">Engineering</option>
                  <option value="dept-2">Human Resources</option>
                  <option value="dept-3">Finance</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Designation (Job Role)</Label>
                <Select className="h-10">
                  <option value="des-1">Software Engineer</option>
                  <option value="des-2">Product Manager</option>
                  <option value="des-3">HR Specialist</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Branch / Location</Label>
                <Select className="h-10">
                  <option value="br-1">London HQ</option>
                  <option value="br-2">New York Office</option>
                  <option value="br-3">Remote</option>
                </Select>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Residential Address</h3>
              <p className="text-sm text-slate-500">Home address and current location details.</p>
            </div>
            <div className="space-y-2">
              <Label>Street Address</Label>
              <Input placeholder="123 Innovation Drive" className="h-10" />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>City</Label>
                <Input placeholder="San Francisco" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label>State / Province</Label>
                <Input placeholder="CA" className="h-10" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <Input placeholder="94105" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Select className="h-10">
                  <option value="us">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="ca">Canada</option>
                </Select>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Education History</h3>
              <p className="text-sm text-slate-500">Academic background and qualifications.</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="space-y-2">
                <Label>Degree / Qualification</Label>
                <Input placeholder="e.g. Bachelor of Science in Computer Science" className="h-10 bg-white dark:bg-slate-950" />
              </div>
              <div className="space-y-2">
                <Label>Institution / University</Label>
                <Input placeholder="e.g. Stanford University" className="h-10 bg-white dark:bg-slate-950" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>Start Year</Label>
                  <Input placeholder="2018" className="h-10 bg-white dark:bg-slate-950" />
                </div>
                <div className="space-y-2">
                  <Label>Graduation Year</Label>
                  <Input placeholder="2022" className="h-10 bg-white dark:bg-slate-950" />
                </div>
              </div>
            </div>
            <Button variant="outline" type="button" className="w-full h-10 border-dashed">
              <Plus className="w-4 h-4 mr-2 text-slate-500" /> Add Another Degree
            </Button>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Work Experience</h3>
              <p className="text-sm text-slate-500">Previous employment and roles.</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input placeholder="e.g. Senior Developer" className="h-10 bg-white dark:bg-slate-950" />
              </div>
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input placeholder="e.g. TechCorp Inc." className="h-10 bg-white dark:bg-slate-950" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" className="h-10 bg-white dark:bg-slate-950" />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" className="h-10 bg-white dark:bg-slate-950" />
                </div>
              </div>
            </div>
            <Button variant="outline" type="button" className="w-full h-10 border-dashed">
              <Plus className="w-4 h-4 mr-2 text-slate-500" /> Add Another Role
            </Button>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Bank Details</h3>
              <p className="text-sm text-slate-500">Salary account and payroll information.</p>
            </div>
            <div className="space-y-2">
              <Label>Bank Name</Label>
              <Input placeholder="e.g. Chase Bank" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label>Account Holder Name</Label>
              <Input placeholder="John Doe" className="h-10" />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input placeholder="0000000000" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label>Routing Number / IFSC</Label>
                <Input placeholder="ROUTING123" className="h-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Account Type</Label>
              <Select className="h-10">
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </Select>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Identity Documents</h3>
              <p className="text-sm text-slate-500">Upload government ID and tax forms.</p>
            </div>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Click to upload or drag and drop</h4>
              <p className="text-xs text-slate-500 max-w-xs">SVG, PNG, JPG or PDF (max. 5MB)</p>
            </div>
            <div className="space-y-3 mt-6">
              <Label>Required Documents Checklist</Label>
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg">
                <input type="checkbox" className="rounded border-slate-300 text-primary w-4 h-4" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Government ID (Passport / Driver's License)</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg">
                <input type="checkbox" className="rounded border-slate-300 text-primary w-4 h-4" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Tax Form (W-4 / W-9)</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg">
                <input type="checkbox" className="rounded border-slate-300 text-primary w-4 h-4" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Signed Offer Letter</span>
              </div>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Final Review</h3>
              <p className="text-sm text-slate-500">Please review the details before saving.</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 p-5 space-y-4">
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <div className="text-slate-500 mb-1">Name</div>
                  <div className="font-medium text-slate-900 dark:text-white">{formData.firstName} {formData.lastName}</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">Email</div>
                  <div className="font-medium text-slate-900 dark:text-white">{formData.email}</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">Joining Date</div>
                  <div className="font-medium text-slate-900 dark:text-white">{formData.joiningDate}</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">Status</div>
                  <div className="font-medium text-slate-900 dark:text-white">{formData.status}</div>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 p-4 rounded-lg flex gap-3 text-sm">
              <Shield className="w-5 h-5 shrink-0 mt-0.5" />
              <p>By saving this record, you confirm the details are correct. The employee will receive an automated onboarding email.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="p-0 sm:max-w-4xl w-[90vw] flex flex-col h-full overflow-hidden bg-white dark:bg-slate-950">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-950 z-10 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {isEditing ? 'Edit Employee' : 'Onboard New Employee'}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {isEditing ? 'Update employee profile records.' : 'Complete the wizard to register a new employee.'}
            </p>
          </div>
        </div>

        {/* Body Layout */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Sidebar (Wizard Steps) */}
          <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 overflow-y-auto hidden md:block shrink-0">
            <div className="p-4 space-y-1.5">
              {WIZARD_STEPS.map((step, idx) => {
                const isActive = idx === activeStepIndex;
                const isPassed = idx < activeStepIndex;
                const Icon = step.icon;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStepIndex(idx)}
                    type="button"
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left relative group",
                      isActive ? "bg-white dark:bg-slate-800 text-primary shadow-sm border border-slate-200 dark:border-slate-700" : 
                      isPassed ? "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50" : 
                      "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                    )}
                  >
                    {isPassed && !isActive ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300")} />
                    )}
                    <span>{step.label}</span>
                    {isActive && (
                      <div className="absolute right-0 w-1 h-6 bg-primary rounded-l-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Form Content */}
          <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-950 overflow-hidden relative">
            <form id="employee-wizard-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">
              {renderStepContent()}
            </form>

            {/* Footer */}
            <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex justify-between shrink-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => activeStepIndex > 0 ? setActiveStepIndex(prev => prev - 1) : onOpenChange(false)}
              >
                {activeStepIndex > 0 ? 'Back' : 'Cancel'}
              </Button>
              <Button type="submit" form="employee-wizard-form" disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {activeStepIndex === 9 ? (isEditing ? 'Save Changes' : 'Create Employee') : 'Continue'}
                {activeStepIndex < 9 && <ChevronRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </div>
        </div>

      </SheetContent>
    </Sheet>
  );
}

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import {
  GitBranch,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserCheck,
  Shield,
  Layers,
  ArrowRight,
  Sparkles,
  Save,
  PlayCircle,
  X
} from 'lucide-react';
import { WorkflowDefinition, WorkflowStep, WorkflowCondition } from '../types/workflow';
import { workflowApi } from '../api/workflowApi';

interface VisualWorkflowDesignerProps {
  initialWorkflow?: WorkflowDefinition | null;
  onClose: () => void;
  onSaved: () => void;
}

export function VisualWorkflowDesigner({ initialWorkflow, onClose, onSaved }: VisualWorkflowDesignerProps) {
  const [formData, setFormData] = useState<Partial<WorkflowDefinition>>(() => {
    if (initialWorkflow) {
      return {
        ...initialWorkflow,
        steps: initialWorkflow.steps.map((s) => ({
          ...s,
          conditions: s.conditions ? [...s.conditions] : []
        }))
      };
    }
    return {
      code: `WF-CUSTOM-${Math.floor(100 + Math.random() * 900)}`,
      name: 'New Custom Approval Workflow',
      module: 'Leave',
      category: 'Core HR',
      description: 'Custom multi-step business approval workflow',
      triggerEvent: 'OnSubmit',
      status: 'Draft',
      steps: [
        {
          stepKey: 'step_manager',
          stepName: 'Line Manager Review',
          description: 'Direct reporting manager approval',
          orderIndex: 1,
          approverType: 'EmployeeManager',
          approvalMode: 'AnyOne',
          isParallel: false,
          minimumApproversRequired: 1,
          timeoutHours: 24,
          escalationEnabled: true,
          escalateAfterHours: 24,
          escalateToType: 'HR',
          conditions: []
        },
        {
          stepKey: 'step_hr',
          stepName: 'HR Department Sign-off',
          description: 'HR policy and compliance verification',
          orderIndex: 2,
          approverType: 'HR',
          approvalMode: 'AnyOne',
          isParallel: false,
          minimumApproversRequired: 1,
          timeoutHours: 48,
          escalationEnabled: false,
          escalateAfterHours: 48,
          escalateToType: 'None',
          conditions: []
        }
      ]
    };
  });

  const [saving, setSaving] = useState(false);
  const [selectedStepIdx, setSelectedStepIdx] = useState<number>(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const steps = formData.steps || [];

  const handleAddStep = () => {
    const newIdx = steps.length + 1;
    const newStep: WorkflowStep = {
      stepKey: `step_${newIdx}`,
      stepName: `Approval Stage ${newIdx}`,
      description: `Verification stage ${newIdx}`,
      orderIndex: newIdx,
      approverType: 'EmployeeManager',
      approvalMode: 'AnyOne',
      isParallel: false,
      minimumApproversRequired: 1,
      timeoutHours: 24,
      escalationEnabled: false,
      escalateAfterHours: 24,
      escalateToType: 'Manager',
      conditions: []
    };
    setFormData((prev) => ({ ...prev, steps: [...(prev.steps || []), newStep] }));
    setSelectedStepIdx(steps.length);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) {
      alert('A workflow must have at least one stage.');
      return;
    }
    const filtered = steps.filter((_, i) => i !== index).map((s, idx) => ({ ...s, orderIndex: idx + 1 }));
    setFormData((prev) => ({ ...prev, steps: filtered }));
    setSelectedStepIdx(Math.max(0, index - 1));
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= steps.length) return;

    const newSteps = [...steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIdx];
    newSteps[targetIdx] = temp;

    const reordered = newSteps.map((s, idx) => ({ ...s, orderIndex: idx + 1 }));
    setFormData((prev) => ({ ...prev, steps: reordered }));
    setSelectedStepIdx(targetIdx);
  };

  const handleDuplicateStep = (index: number) => {
    const orig = steps[index];
    const copy: WorkflowStep = {
      ...orig,
      stepKey: `${orig.stepKey}_copy`,
      stepName: `${orig.stepName} (Copy)`,
      orderIndex: steps.length + 1,
      conditions: orig.conditions ? [...orig.conditions] : []
    };
    setFormData((prev) => ({ ...prev, steps: [...(prev.steps || []), copy] }));
    setSelectedStepIdx(steps.length);
  };

  const updateSelectedStep = (fields: Partial<WorkflowStep>) => {
    const updated = steps.map((s, idx) => (idx === selectedStepIdx ? { ...s, ...fields } : s));
    setFormData((prev) => ({ ...prev, steps: updated }));
  };

  const handleAddCondition = () => {
    const curStep = steps[selectedStepIdx];
    if (!curStep) return;
    const newCond: WorkflowCondition = {
      field: 'days',
      operator: 'GreaterThan',
      value: '5',
      logic: 'AND',
      orderIndex: (curStep.conditions?.length || 0) + 1
    };
    updateSelectedStep({ conditions: [...(curStep.conditions || []), newCond] });
  };

  const handleRemoveCondition = (cIdx: number) => {
    const curStep = steps[selectedStepIdx];
    if (!curStep) return;
    const filtered = (curStep.conditions || []).filter((_, i) => i !== cIdx);
    updateSelectedStep({ conditions: filtered });
  };

  const handleSave = async (publishImmediately: boolean = false) => {
    try {
      setSaving(true);
      setMessage(null);

      // Validation
      if (!formData.name?.trim()) {
        throw new Error('Workflow name is required.');
      }
      if (!formData.steps || formData.steps.length === 0) {
        throw new Error('Workflow must contain at least one approval stage.');
      }

      const payload = {
        ...formData,
        status: publishImmediately ? 'Active' : formData.status || 'Draft'
      };

      const saved = await workflowApi.saveDefinition(payload);
      if (publishImmediately && saved.id) {
        await workflowApi.publishDefinition(saved.id);
      }

      setMessage({
        type: 'success',
        text: publishImmediately
          ? 'Workflow successfully published and active!'
          : 'Workflow draft saved successfully.'
      });

      setTimeout(() => {
        onSaved();
      }, 800);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save workflow' });
    } finally {
      setSaving(false);
    }
  };

  const currentStep = steps[selectedStepIdx];

  // Validation Checks
  const validationItems = [
    { label: 'Workflow Name Provided', valid: !!formData.name?.trim() },
    { label: 'Module Assigned', valid: !!formData.module },
    { label: 'At least 1 Approval Stage', valid: steps.length > 0 },
    { label: 'All Stages Named', valid: steps.every((s) => s.stepName?.trim().length > 0) },
    { label: 'Approvers Configured', valid: steps.every((s) => !!s.approverType) }
  ];

  const allValid = validationItems.every((v) => v.valid);

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <GitBranch className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {formData.name || 'Untitled Workflow'}
              </h1>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Code: {formData.code} • Module: {formData.module} • Status: {formData.status}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" onClick={onClose} disabled={saving} className="flex items-center gap-1.5">
            <X className="w-4 h-4" /> Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-1.5 border-slate-300"
          >
            <Save className="w-4 h-4" /> Save Draft
          </Button>
          <Button
            onClick={() => handleSave(true)}
            disabled={saving || !allValid}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
          >
            <PlayCircle className="w-4 h-4" /> Publish & Activate
          </Button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-sm flex justify-between items-center ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: General Info & Pipeline Stages List */}
        <div className="lg:col-span-5 space-y-6">
          {/* General Workflow Attributes */}
          <Card className="shadow-sm border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-base font-semibold">Workflow Metadata</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Workflow Name</label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g., Senior Management Leave Sign-off"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Module</label>
                  <select
                    value={formData.module || 'Leave'}
                    onChange={(e) => setFormData((p) => ({ ...p, module: e.target.value }))}
                    className="w-full mt-1 p-2 text-sm border rounded-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                  >
                    <option value="Leave">Leave Management</option>
                    <option value="Attendance">Attendance & Biometrics</option>
                    <option value="Payroll">Payroll & Expenses</option>
                    <option value="Recruitment">Recruitment & ATS</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Performance">Performance & Appraisal</option>
                    <option value="Asset">Asset Management</option>
                    <option value="Document">Document Approvals</option>
                    <option value="Offboarding">Offboarding</option>
                    <option value="CustomHR">Custom HR Requests</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={formData.category || 'General'}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                    className="w-full mt-1 p-2 text-sm border rounded-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                  >
                    <option value="Core HR">Core HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="Talent">Talent</option>
                    <option value="IT">IT Security</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Trigger Event</label>
                <select
                  value={formData.triggerEvent || 'OnSubmit'}
                  onChange={(e) => setFormData((p) => ({ ...p, triggerEvent: e.target.value }))}
                  className="w-full mt-1 p-2 text-sm border rounded-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                >
                  <option value="OnSubmit">On Request Submission (Standard)</option>
                  <option value="OnStatusChange">On Entity Status Change</option>
                  <option value="Scheduled">Scheduled Batch Trigger</option>
                  <option value="Manual">Manual Manager Invocation</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  rows={2}
                  placeholder="Explain the intent and scope of this workflow..."
                  className="w-full mt-1 p-2 text-sm border rounded-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                />
              </div>
            </CardContent>
          </Card>

          {/* Sequential Stages Navigator */}
          <Card className="shadow-sm border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" /> Approval Stages Pipeline
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">Sequential & parallel execution order</CardDescription>
              </div>
              <Button size="sm" onClick={handleAddStep} className="flex items-center gap-1.5 h-8">
                <Plus className="w-3.5 h-3.5" /> Add Stage
              </Button>
            </CardHeader>

            <CardContent className="p-3 space-y-2.5">
              {steps.map((step, idx) => {
                const isSelected = idx === selectedStepIdx;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedStepIdx(idx)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                          isSelected
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          {step.stepName || 'Unnamed Step'}
                          {step.isParallel && (
                            <Badge variant="outline" className="text-[10px] py-0 px-1 text-purple-700 bg-purple-50">
                              Parallel
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                          <span className="text-primary font-medium">{step.approverType}</span>
                          <span>•</span>
                          <span>{step.timeoutHours}h SLA</span>
                          {step.conditions && step.conditions.length > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-amber-600 font-medium">
                                {step.conditions.length} {step.conditions.length === 1 ? 'Rule' : 'Rules'}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveStep(idx, 'up')}
                        disabled={idx === 0}
                        className="h-7 w-7"
                        title="Move Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveStep(idx, 'down')}
                        disabled={idx === steps.length - 1}
                        className="h-7 w-7"
                        title="Move Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDuplicateStep(idx)}
                        className="h-7 w-7"
                        title="Duplicate Stage"
                      >
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveStep(idx)}
                        disabled={steps.length <= 1}
                        className="h-7 w-7 text-red-500 hover:text-red-700"
                        title="Remove Stage"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Validation Checklist */}
          <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-slate-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Pre-Publish Validation Checklist
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 space-y-1.5">
              {validationItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1">
                  <span className={item.valid ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}>
                    {item.label}
                  </span>
                  {item.valid ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">✓ Ready</span>
                  ) : (
                    <span className="text-amber-600 font-medium">Pending</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Active Step Deep Configuration */}
        <div className="lg:col-span-7">
          {currentStep ? (
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                      {selectedStepIdx + 1}
                    </span>
                    <CardTitle className="text-base font-bold">Configure Stage: {currentStep.stepName}</CardTitle>
                  </div>
                  <CardDescription className="text-xs mt-1">
                    Approver resolution, SLA timeouts, conditional logic, and escalation policies.
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Basic Stage Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Stage Name</label>
                    <Input
                      value={currentStep.stepName || ''}
                      onChange={(e) => updateSelectedStep({ stepName: e.target.value })}
                      placeholder="e.g. Line Manager Approval"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Stage Key</label>
                    <Input
                      value={currentStep.stepKey || ''}
                      onChange={(e) => updateSelectedStep({ stepKey: e.target.value })}
                      placeholder="e.g. step_manager"
                      className="mt-1 font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Approver Resolution Matrix */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-primary" /> Approver Resolution & Authority
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-600">Approver Type</label>
                      <select
                        value={currentStep.approverType}
                        onChange={(e) => updateSelectedStep({ approverType: e.target.value })}
                        className="w-full mt-1 p-2 text-sm border rounded-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                      >
                        <option value="EmployeeManager">Employee's Direct Manager</option>
                        <option value="DepartmentManager">Department Head</option>
                        <option value="HR">HR Specialist / Desk</option>
                        <option value="HRManager">HR Business Partner / Director</option>
                        <option value="Finance">Finance Accounts Payable</option>
                        <option value="Payroll">Payroll Lead</option>
                        <option value="SpecificUser">Specific Designated Employee</option>
                        <option value="SpecificRole">Specific Role Authority</option>
                        <option value="SpecificDepartment">Specific Department</option>
                        <option value="WorkflowGroup">Workflow Committee Group</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-600">Approval Decision Mode</label>
                      <select
                        value={currentStep.approvalMode}
                        onChange={(e) => updateSelectedStep({ approvalMode: e.target.value })}
                        className="w-full mt-1 p-2 text-sm border rounded-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                      >
                        <option value="AnyOne">Any Single Approver (First to act)</option>
                        <option value="All">All Approvers Must Agree (Unanimous)</option>
                        <option value="Majority">Majority Vote (&gt; 50%)</option>
                        <option value="Sequential">Sequential Sub-chain</option>
                      </select>
                    </div>
                  </div>

                  {currentStep.approverType === 'SpecificRole' && (
                    <div>
                      <label className="text-xs font-medium text-slate-600">Designated Role Name</label>
                      <Input
                        value={currentStep.specificRoleName || ''}
                        onChange={(e) => updateSelectedStep({ specificRoleName: e.target.value })}
                        placeholder="e.g. IT_Security_Lead, VP_Finance"
                        className="mt-1"
                      />
                    </div>
                  )}

                  {currentStep.approverType === 'SpecificUser' && (
                    <div>
                      <label className="text-xs font-medium text-slate-600">Designated Employee ID / Name</label>
                      <Input
                        value={currentStep.specificUserId || ''}
                        onChange={(e) => updateSelectedStep({ specificUserId: e.target.value })}
                        placeholder="e.g. EMP-0042 (Jennifer Vance)"
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>

                {/* SLA, Timeout & Escalation */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-500" /> SLA Timeout & Automated Escalation
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-600">SLA Timeout (Hours)</label>
                      <Input
                        type="number"
                        value={currentStep.timeoutHours || 24}
                        onChange={(e) => updateSelectedStep({ timeoutHours: parseInt(e.target.value) || 24 })}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-600">Enable Automated Escalation</label>
                      <div className="mt-2 flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={currentStep.escalationEnabled}
                            onChange={(e) => updateSelectedStep({ escalationEnabled: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                        <span className="text-xs text-slate-600">
                          {currentStep.escalationEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {currentStep.escalationEnabled && (
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <div>
                        <label className="text-xs font-medium text-slate-600">Escalate After (Hours)</label>
                        <Input
                          type="number"
                          value={currentStep.escalateAfterHours || 24}
                          onChange={(e) =>
                            updateSelectedStep({ escalateAfterHours: parseInt(e.target.value) || 24 })
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-slate-600">Escalate To</label>
                        <select
                          value={currentStep.escalateToType || 'HR'}
                          onChange={(e) => updateSelectedStep({ escalateToType: e.target.value })}
                          className="w-full mt-1 p-2 text-sm border rounded-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                        >
                          <option value="Manager">Manager's Manager</option>
                          <option value="HR">HR Department Head</option>
                          <option value="HRManager">VP Human Resources</option>
                          <option value="Finance">Finance Controller</option>
                          <option value="SpecificUser">Specific Escalation Officer</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Conditional Rules Engine */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" /> Conditional Execution Rules
                    </h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleAddCondition}
                      className="text-xs h-7 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Condition
                    </Button>
                  </div>

                  {(!currentStep.conditions || currentStep.conditions.length === 0) ? (
                    <p className="text-xs text-slate-500 italic">
                      No conditional rules configured. This stage will execute unconditionally for all requests.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {currentStep.conditions.map((cond, cIdx) => (
                        <div key={cIdx} className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border text-xs">
                          {cIdx > 0 && (
                            <select
                              value={cond.logic}
                              onChange={(e) => {
                                const newConds = [...currentStep.conditions];
                                newConds[cIdx].logic = e.target.value;
                                updateSelectedStep({ conditions: newConds });
                              }}
                              className="p-1 font-bold text-indigo-600 bg-indigo-50 rounded"
                            >
                              <option value="AND">AND</option>
                              <option value="OR">OR</option>
                            </select>
                          )}
                          <span className="font-semibold text-slate-500">IF</span>
                          <select
                            value={cond.field}
                            onChange={(e) => {
                              const newConds = [...currentStep.conditions];
                              newConds[cIdx].field = e.target.value;
                              updateSelectedStep({ conditions: newConds });
                            }}
                            className="p-1 border rounded bg-transparent"
                          >
                            <option value="days">Leave Days</option>
                            <option value="amount">Expense Amount ($)</option>
                            <option value="department">Employee Department</option>
                            <option value="salary_increase_pct">Salary Increase %</option>
                            <option value="request_type">Request Priority / Type</option>
                          </select>

                          <select
                            value={cond.operator}
                            onChange={(e) => {
                              const newConds = [...currentStep.conditions];
                              newConds[cIdx].operator = e.target.value;
                              updateSelectedStep({ conditions: newConds });
                            }}
                            className="p-1 border rounded bg-transparent"
                          >
                            <option value="Equals">Equals</option>
                            <option value="NotEquals">Not Equals</option>
                            <option value="GreaterThan">&gt; Greater Than</option>
                            <option value="LessThan">&lt; Less Than</option>
                            <option value="GreaterThanOrEqual">&gt;= Greater/Equal</option>
                            <option value="LessThanOrEqual">&lt;= Less/Equal</option>
                            <option value="Contains">Contains</option>
                            <option value="InList">In List</option>
                          </select>

                          <Input
                            value={cond.value}
                            onChange={(e) => {
                              const newConds = [...currentStep.conditions];
                              newConds[cIdx].value = e.target.value;
                              updateSelectedStep({ conditions: newConds });
                            }}
                            placeholder="Value"
                            className="h-7 text-xs w-28"
                          />

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCondition(cIdx)}
                            className="h-6 w-6 text-red-500 hover:text-red-700 ml-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center p-12 text-slate-400 border border-dashed rounded-2xl">
              Select a stage from the pipeline to configure details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

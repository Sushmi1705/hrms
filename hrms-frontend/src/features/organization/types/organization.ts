export interface Company {
  id: string;
  code: string;
  name: string;
  description?: string;
  businessUnitsCount?: number;
}

export interface BusinessUnit {
  id: string;
  companyId: string;
  companyName?: string;
  code: string;
  name: string;
  branchesCount?: number;
}

export interface Branch {
  id: string;
  businessUnitId: string;
  businessUnitName?: string;
  companyName?: string;
  code: string;
  name: string;
  locationsCount?: number;
  departmentsCount?: number;
}

export interface Location {
  id: string;
  branchId: string;
  branchName?: string;
  code: string;
  name: string;
  address?: string;
}

export interface Department {
  id: string;
  branchId: string;
  branchName?: string;
  businessUnitName?: string;
  companyName?: string;
  code: string;
  name: string;
  designationsCount?: number;
}

export interface Designation {
  id: string;
  departmentId: string;
  departmentName?: string;
  branchName?: string;
  code: string;
  name: string;
}

export interface JobGrade {
  id: string;
  code: string;
  name: string;
  level: number;
}

export interface CostCenter {
  id: string;
  businessUnitId: string;
  businessUnitName?: string;
  code: string;
  name: string;
}

export interface OrganizationHierarchySummary {
  totalCompanies: number;
  totalBusinessUnits: number;
  totalBranches: number;
  totalDepartments: number;
  totalDesignations: number;
  totalJobGrades: number;
  totalEmployees: number;
}

export interface OrganizationHierarchyData {
  summary: OrganizationHierarchySummary;
  tree: {
    id: string;
    code: string;
    name: string;
    description?: string;
    businessUnits: {
      id: string;
      companyId: string;
      code: string;
      name: string;
      branches: {
        id: string;
        businessUnitId: string;
        code: string;
        name: string;
        locations: {
          id: string;
          branchId: string;
          code: string;
          name: string;
          address?: string;
        }[];
        departments: {
          id: string;
          branchId: string;
          code: string;
          name: string;
          employeeCount: number;
          designations: {
            id: string;
            departmentId: string;
            code: string;
            name: string;
          }[];
        }[];
      }[];
      costCenters: {
        id: string;
        businessUnitId: string;
        code: string;
        name: string;
      }[];
    }[];
  }[];
}

export type OrgEntityType = 
  | 'company'
  | 'businessUnit'
  | 'branch'
  | 'location'
  | 'department'
  | 'designation'
  | 'jobGrade'
  | 'costCenter';

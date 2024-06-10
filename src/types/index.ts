export interface Company {
    name: string;
    description: string;
    logo: string;
    website: string;
  }
  
  export interface Job {
    company: Company;
    type: string;
    description: string;
    url: string;
  }
  
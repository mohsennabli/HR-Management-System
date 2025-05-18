    export interface BaseContract {
        id?: number;
        employee_id: number;
        start_date: string;
        end_date: string;
        pattern: 'full-time' | 'part-time';
        employee?: {
            id: number;
            first_name: string;
            last_name: string;
        };
        created_at?: string;
        updated_at?: string;
    }

    export interface SIVPContract extends BaseContract {
        duration: number;
        sign: string;
        breakup: string;
    }

    export interface MedysisContract extends BaseContract {
        type: string;
    }

    export type Contract = BaseContract | SIVPContract | MedysisContract; 
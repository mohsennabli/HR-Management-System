export interface BaseContract {
    id?: number;
    employee_id: number;
    start_date: Date;
    end_date: Date;
    pattern: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface SIVPContract extends BaseContract {
    duration: number;
    sign: string;
    breakup: string;
}

export interface MedysisContract extends BaseContract {
    type: string;
}

export type Contract = SIVPContract | MedysisContract; 
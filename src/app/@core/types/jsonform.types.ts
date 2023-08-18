interface JsonFormValidators {
    min?: number;
    max?: number;
    required?: boolean;
    requiredTrue?: boolean;
    email?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    nullValidator?: boolean;
}

interface JsonFormControlOptions {
    min?: string;
    max?: string;
    step?: string;
    icon?: string;
}

export interface JsonFormControls {
    name?: string;
    label?: string;
    value?: string;
    values?: string[];
    type?: string;
    options?: JsonFormControlOptions;
    validators?: JsonFormValidators;
}

export interface JsonFormData {
    controls: JsonFormControls[];
}

export type AlgorithmOptions = Record<string, string>;

/**
 * Form validation utilities
 */

export interface ValidationRule {
    type: 'required' | 'email' | 'url' | 'phone' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
    value?: any;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export class FormValidator {
    /**
     * Validate email format
     */
    static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate URL format
     */
    static isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Validate phone number (basic)
     */
    static isValidPhone(phone: string): boolean {
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    /**
     * Validate against custom pattern
     */
    static isValidPattern(value: string, pattern: RegExp): boolean {
        return pattern.test(value);
    }

    /**
     * Validate field against rules
     */
    static validateField(value: any, rules: ValidationRule[]): ValidationResult {
        const errors: string[] = [];

        for (const rule of rules) {
            switch (rule.type) {
                case 'required':
                    if (!value || (typeof value === 'string' && !value.trim())) {
                        errors.push(rule.message);
                    }
                    break;

                case 'email':
                    if (value && !this.isValidEmail(value)) {
                        errors.push(rule.message);
                    }
                    break;

                case 'url':
                    if (value && !this.isValidUrl(value)) {
                        errors.push(rule.message);
                    }
                    break;

                case 'phone':
                    if (value && !this.isValidPhone(value)) {
                        errors.push(rule.message);
                    }
                    break;

                case 'minLength':
                    if (value && value.length < rule.value) {
                        errors.push(rule.message);
                    }
                    break;

                case 'maxLength':
                    if (value && value.length > rule.value) {
                        errors.push(rule.message);
                    }
                    break;

                case 'pattern':
                    if (value && !this.isValidPattern(value, rule.value)) {
                        errors.push(rule.message);
                    }
                    break;

                case 'custom':
                    if (rule.value && !rule.value(value)) {
                        errors.push(rule.message);
                    }
                    break;
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    /**
     * Sanitize input to prevent XSS
     */
    static sanitize(input: string): string {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    /**
     * Validate form data
     */
    static validateForm(
        data: Record<string, unknown>,
        schema: Record<string, ValidationRule[]>
    ): Record<string, string[]> {
        const errors: Record<string, string[]> = {};

        for (const [field, rules] of Object.entries(schema)) {
            const result = this.validateField(data[field], rules);
            if (!result.isValid) {
                errors[field] = result.errors;
            }
        }

        return errors;
    }
}

/**
 * React hook for form validation
 */
import { useState } from 'react';

export function useFormValidation<T extends Record<string, unknown>>(
    initialValues: T,
    schema: Record<keyof T, ValidationRule[]>,
    onSubmit: (values: T) => void | Promise<void>
) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));

        // Validate on change if field is touched
        if (touched[name]) {
            const fieldSchema = schema[name as keyof T];
            if (fieldSchema) {
                const result = FormValidator.validateField(value, fieldSchema);
                if (result.errors.length > 0) {
                    setErrors((prev) => ({ ...prev, [name]: result.errors }));
                } else {
                    setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors[name];
                        return newErrors;
                    });
                }
            }
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));

        // Validate on blur
        const fieldSchema = schema[name as keyof T];
        if (fieldSchema) {
            const result = FormValidator.validateField(value, fieldSchema);
            if (result.errors.length > 0) {
                setErrors((prev) => ({ ...prev, [name]: result.errors }));
            } else {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validate all fields
        const formErrors = FormValidator.validateForm(values, schema);
        setErrors(formErrors);

        // Mark all fields as touched
        const allTouched: Record<string, boolean> = {};
        Object.keys(schema).forEach((key) => {
            allTouched[key] = true;
        });
        setTouched(allTouched);

        if (Object.keys(formErrors).length === 0) {
            try {
                await onSubmit(values);
            } catch (error) {
                console.error('Form submission error:', error);
            }
        }

        setIsSubmitting(false);
    };

    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        setValues,
        resetForm: () => {
            setValues(initialValues);
            setErrors({});
            setTouched({});
        },
    };
}

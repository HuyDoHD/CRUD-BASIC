export type UserFormData = {
    _id?: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    password?: string;
    confirmPassword?: string;
    newPassword?: string;
};

export type User = {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
};
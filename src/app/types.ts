export interface Department {
    departmentId: number;
    displayName: string;
    picture: string;
}

export interface RandomObject {
    palette?: string[]; //
    objectID?: number; //
    primaryImage?: string;
    primaryImageSmall?: string; //
    title?: string; //
    artistDisplayName?: string; //
    objectDate?: string; //
    country?: string; //
}

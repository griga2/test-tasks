export class ContactClass {
    type: string = '';
    metka: string = '';
    login: string = '';
    password: string | null = '';
    id: number = 0;
    errors: Array<string> = [];
}

export class ContactClassLocalStore {
    type: string = '';
    metka: Array<{text:string}> = [];
    login: string = '';
    password: string | null = '';
    id: number = 0;
}
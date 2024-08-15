import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { ContactClass, ContactClassLocalStore } from '../models/contactsModel';

export const useContactsStoreStore = defineStore('contactsStore', () => {

    const contactsList = ref<Array<ContactClass>>([
    ]);

    let counter = 0;

    const AddContact = () => {
        contactsList.value.push({
            id: counter + new Date().getTime(),
            type:"Локальная",
            errors: [],
            login: '',
            metka: '',
            password: ''
        });
        counter++;  
    }

    const SaveContact = async (contact: ContactClass) => {
        console.log('save contact')
        if (contact.errors?.length == 0) {
            const _contactList : Array<ContactClassLocalStore>= JSON.parse(await localStorage.getItem('contactsList') || "[]")
            _contactList.push({
                type: contact.type,
                id: contact.id,
                login: contact.login,
                metka: contact.metka != '' ? contact.metka.split(';').map(el => {return {text:el.trim()}}).filter(el => el.text != '') : [],
                password: contact.password});
            await localStorage.setItem('contactsList', JSON.stringify(_contactList))
        }
        console.log(JSON.parse(await localStorage.getItem('contactsList') || '[]'));
    }

    const DeleteContact = async (contactId: number) => {
        let _contactList: Array<ContactClassLocalStore> = JSON.parse(await localStorage.getItem('contactsList') || "[]");
        _contactList = _contactList.filter((el: ContactClassLocalStore) => el.id != contactId);
        await localStorage.setItem('contactsList',JSON.stringify(_contactList));
        contactsList.value = contactsList.value.filter((el: ContactClass) => el.id != contactId);
        // contactsList.value = _contactList.map((el: ContactClassLocalStore) => { console.log(el); const new_el: ContactClass = {
        //     id: el.id,
        //     login: el.login,
        //     metka: el.metka?.map(el => el.text)?.reduce((_pr: string = '', _cur: string) => { 
        //         if (_pr == '') return _pr + _cur
        //         return _pr + '; '+ _cur; }) || '',
        //     type: el.type,
        //     password: el.password,
        //     errors: []
        // }; return new_el;
        // });

    }

    const getContacts = async () => {
        contactsList.value = JSON.parse(await localStorage.getItem('contactsList') || '[]').map((el: ContactClassLocalStore) => { const new_el: ContactClass = {
                id: el.id,
                login: el.login,
                metka: el.metka.length != 0 ? el.metka?.map(el => el.text).reduce((_pr: string = '', _cur: string) => { return _pr + _cur + '; '; }, '') || '': '',
                type: el.type,
                password: el.password,
                errors: []
            }; return new_el;
        });
    }

    return {
        SaveContact,
        DeleteContact,
        AddContact,
        contactsList,  
        getContacts, 
    }
})


<script lang="ts" setup>
import {useContactsStoreStore} from'./store/index'
import { storeToRefs } from 'pinia'
import {onMounted, computed, getCurrentInstance} from 'vue'
import type { ContactClass } from './models/contactsModel';
// import DeleteIcon from '../../assets/svg/delete_icon_trash_can.svg?component'
const instance = getCurrentInstance();

const store = useContactsStoreStore();
const {
    contactsList,
} = storeToRefs(store);


const clickAddContact = () => {
    store.AddContact();
}

onMounted(async () => {
    await store.getContacts()
})

const typeList = [
        "LDAP",
        "Локальная"
    ]

const getColspan = (type: string) => {
    return type == 'LDAP'? 2 : 1
} 

const clickDeleteContact = (contactId: string) => {
    store.DeleteContact(contactId)
}

const validateMetka = (metka: string) => {
    if (metka.length > 50) return false
    return true
}

const validateLogin = (login: string) => {
    if (!login) return false
    if (login.length > 100) return false
    return true
 }

const validatePassword = (pass: string | null, type: string) => {
    if (!pass && type == 'Локальная') return false
    if (pass == null && type == 'LDAP') return true
    if (typeof(pass) == 'string' && pass.length > 100) return false
    return true
}

const validateType = (type: string) => {
    if(!type) return false
    return true
}

const validateContact = async (contact: ContactClass) => {
    if (!validatePassword(contact.password, contact.type) && !contact.errors?.includes('password')) {
        contact.errors.push('password')
    } else if (validatePassword(contact.password, contact.type)) {
        contact.errors = contact.errors.filter(el => el != 'password')
    }
    if (!validateLogin(contact.login) && !contact.errors?.includes('login')) {
        contact.errors.push('login')
    } else if (validateLogin(contact.login)) {
        contact.errors = contact.errors.filter(el => el != 'login')
    }
    if (!validateMetka(contact.metka) && !contact.errors?.includes('metka')) {
        contact.errors.push('metka')
    } else if (validateMetka(contact.metka)) {
        contact.errors = contact.errors.filter(el => el != 'metka')
    }
    if (!validateType(contact.type) && !contact.errors?.includes('type')) { 
        contact.errors.push('type')
    } else if (validateType(contact.type)) {
        contact.errors = contact.errors.filter(el => el != 'type')
    }
    if (contact.errors?.length == 0) await store.SaveContact(contact);
    console.log(contact)
    return contact
}

const changeType = (contact: ContactClass) => {
    if (contact.type == 'LDAP') contact.password = null
}


</script>

<template>
    
    <main>
        <header>
            <h1>Учётные записи</h1>
            <VaButton
                @click="clickAddContact"
                class="mr-6 mb-2"
            >+</VaButton>
        </header>
        <section class="help_block">
            <VaIcon
                :name="'help'"
                size="large"
                color="primary"
            />
            <span>Для указания несколькхи меток для одной пары логин/пароль используйте разделитель ; </span>
        </section>

        <section class="va-table-responsive">
            <table class="va-table">
                <thead>
                    <tr>
                        <th>Метка</th>
                        <th>Тип</th>
                        <th>Логин</th>
                        <th>Пароль</th>
                        <th style="width:24px"></th>
                    </tr>
                </thead>
                <tbody>
                <tr
                v-for="contact in contactsList"
                :key="contact.id"
                v-bind="contact.errors.length"
                >
                    <td>
                            <VaInput
                            class="va_input"
                            v-model="contact.metka"
                            placeholder="Метка"
                            @blur="validateContact(contact)" 
                            :error="contact.errors.includes('metka')"
                            :error-messages="['Поле заполненно неверно']"
                            />
                    </td>
                    <td>

                            <VaSelect
                            v-model="contact.type"
                            class="mb-6"
                            placeholder="Тип"
                            :error="contact.errors.includes('type')"
                            :options="typeList"     
                            @update:modelValue="() => {validateContact(contact); changeType(contact)}"                  
                            />

                    </td>
                    <td v-bind:colspan="getColspan(contact.type)">

                            <VaInput
                                :style="{
                                    width: contact.type != 'LDAP' ? '210px': '480px'
                                }"
                                @blur="validateContact(contact)" 
                                class="va_input"
                                v-model="contact.login"
                                placeholder="Логин"
                                :error="contact.errors.includes('login')"
                                :error-messages="['Поле заполненно неверно']"
                            />

                    </td>
                    <td v-if="contact.type != 'LDAP'">
                        <VaValue
                            v-slot="isPasswordVisible"
                            :default-value="false"
                            >
                            <VaInput
                            class="va_input"
                            v-model="contact.password"
                            placeholder="Пароль"
                            :type="isPasswordVisible.value ? 'text' : 'password'"
                            @blur="validateContact(contact)"
                            @click-append-inner="isPasswordVisible.value = !isPasswordVisible.value"
                            :error="contact.errors.includes('password')"
                            :error-messages="['Поле заполненно неверно']"
                            >
                                <template #appendInner>
                                    <VaIcon
                                        :name="isPasswordVisible.value ? 'visibility_off' : 'visibility'"
                                        size="small"
                                        color="primary"
                                    />
                                </template>
                            </VaInput>
                            
                        </VaValue>
                    </td>
                    <td>
                        <img src="@/assets/svg/delete_icon_trash_can.svg?component" alt="" @click="clickDeleteContact(contact.id)">  
                    </td>
                </tr>
            </tbody>
            </table>
        </section>
    </main>
</template>

<style scoped>

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: start;
    }
    
    header{
        display: flex;
        flex-direction: row;
        align-items: start;
        justify-content: center;
        gap:10px;
    }

    thead > tr > th {
        width: 210px;
    }

    .help_block{
        height: 42px;
        padding: 5px 24px;
        display: flex;
        justify-content: center;
        flex-direction: row;
        align-items: center;
        border-radius: 12px;
        background-color: #11101C;
        gap: 6px;
    }
    
    header {
        display: flex;
        justify-content: center;
        flex-direction: row;
        align-items: center;
        margin-bottom: 20px;
        margin-top: 40px;
    }

    h1{
        font-weight: 600;
        font-size: xx-large;
    }
    
</style>
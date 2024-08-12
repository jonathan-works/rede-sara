import { Notify } from 'quasar';

export default function userNotify() {
    const success = (msg) => {
        Notify.create({
            type: 'positive',
            message: msg
        })
    };
    const error = (msg) => {
        Notify.create({
            type: 'negative',
            message: msg
        })
    };
    const alert = (msg) => {
        Notify.create({
            type: 'warning',
            message: msg
        })
    };
    const confirm = (msg) => {
        confirm(msg)
    };
    return {
        success,
        error,
        alert,
        confirm
    }
}
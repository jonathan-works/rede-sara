import { Dialog } from 'quasar';

export default function useDialog() {
    const confirm = (title, msg, fnCallbackOK, fnCallbackCancel) => {
        return Dialog.create({
            title: title,
            message: msg,
            cancel: true,
            persistent: true
        }).onOk(() => {
            if(fnCallbackOK){
                fnCallbackOK();
            }
        }).onCancel(() => {
            if(fnCallbackCancel){
                fnCallbackCancel();
            }
        });
    };
    return {
        confirm
    }
}
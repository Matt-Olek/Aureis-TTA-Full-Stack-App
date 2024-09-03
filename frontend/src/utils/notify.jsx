import { toast } from 'react-toastify'

export const notify = (message, type) => {
    switch (type) {
        case 'success':
            toast.success(message)
            break
        case 'error':
            toast.error(message)
            break
        case 'warning':
            toast.warning(message)
            break
        default:
            toast.info(message)
    }
}
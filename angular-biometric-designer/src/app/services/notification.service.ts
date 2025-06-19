import { Injectable } from "@angular/core";
import Swal from "sweetalert2";

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    constructor() {
    }

    alertSussess(message: string) {
        Swal.fire({
            toast: true,
            icon: 'success',
            position: 'top',
            title: message,
            showConfirmButton: false,
            showCloseButton: true,
            timer: 10000,
            timerProgressBar: true,
            didOpen: () => {
                const swalContainer = document.querySelector('.swal2-container');
                if (swalContainer) {
                    (swalContainer as HTMLElement).style.zIndex = '2000';
                }
            }
        })
    }
    alertError(message: string) {
        Swal.fire({
            toast: true,
            icon: 'error',
            position: 'top',
            title: message,
            showConfirmButton: false,
            showCloseButton: true,
            timer: 10000,
            timerProgressBar: true,
            didOpen: () => {
                const swalContainer = document.querySelector('.swal2-container');
                if (swalContainer) {
                    (swalContainer as HTMLElement).style.zIndex = '2000';
                }
            }
        })
    }
    alertErrorResponeAbp(err: any) {
        var message: string = '';
        if (err.error == null) {
            if (err.status != null || err.statusText != null) {
                if (err.status === "401") message = "Hết phiên làm việc, vui lòng đăng nhập lại!"
                else message = '[' + err.status + '] - ' + err.statusText;
            }
            else
                message = err;
        }
        else if (err.error.error == null)
            message = err.error;
        else
            message = (err.error.error.details
                || err.error.error.message);
        Swal.fire({
            toast: true,
            icon: 'error',
            position: 'top',
            title: message,
            showConfirmButton: false,
            showCloseButton: true,
            timer: 10000,
            timerProgressBar: true,
            didOpen: () => {
                const swalContainer = document.querySelector('.swal2-container');
                if (swalContainer) {
                    (swalContainer as HTMLElement).style.zIndex = '2000';
                }
            }
        })
    }
    alertWarning(message: string) {
        Swal.fire({
            toast: true,
            icon: 'warning',
            position: 'top',
            title: message,
            showConfirmButton: false,
            showCloseButton: true,
            timer: 10000,
            timerProgressBar: true,
            didOpen: () => {
                const swalContainer = document.querySelector('.swal2-container');
                if (swalContainer) {
                    (swalContainer as HTMLElement).style.zIndex = '2000';
                }
            }
        })
    }
    alertInfor(message: string) {
        Swal.fire({
            toast: true,
            icon: 'info',
            position: 'top',
            title: message,
            showConfirmButton: false,
            showCloseButton: true,
            timer: 10000,
            timerProgressBar: true,
            didOpen: () => {
                const swalContainer = document.querySelector('.swal2-container');
                if (swalContainer) {
                    (swalContainer as HTMLElement).style.zIndex = '2000';
                }
            }
        })
    }
    confirm(text: string): Promise<boolean> {
        return new Promise((resolve) => {
            Swal.fire({
                title: text,
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: 'OK',
                cancelButtonText: 'Hủy',
                didOpen: () => {
                    const swalContainer = document.querySelector('.swal2-container');
                    if (swalContainer) {
                        (swalContainer as HTMLElement).style.zIndex = '2000';
                    }

                     // ✅ Giảm kích thước chữ tiêu đề
                    const titleEl = document.querySelector('.swal2-title') as HTMLElement;
                    if (titleEl) {
                        titleEl.style.fontSize = '20px';
                    }

                    // ✅ Đổi màu nút Hủy thành đỏ
                    const cancelBtn = document.querySelector('.swal2-cancel') as HTMLElement;
                    if (cancelBtn) {
                        cancelBtn.style.backgroundColor = '#FF0000';
                        cancelBtn.style.color = 'white';
                    }
                }
            }).then((result) => {
                resolve(result.isConfirmed);
            });
        });
    }
}
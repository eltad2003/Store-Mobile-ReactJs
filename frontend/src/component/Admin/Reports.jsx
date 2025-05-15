import React, { useContext, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';



// Custom upload adapter class
class MyUploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    // Bắt đầu upload
    upload() {
        return this.loader.file.then(
            file =>
                new Promise((resolve, reject) => {
                    const data = new FormData();
                    data.append('file', file);

                    fetch('http://localhost:8080/products/detail_image/upload', {
                        method: 'POST',
                        body: data,
                        headers: {
                            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
                        }
                    })
                        .then(res => res.json())
                        .then(res => {
                            if (!res.url) return reject('No URL returned');
                            resolve({ default: res.url });
                        })
                        .catch(err => reject(err));
                })
        );
    }

    abort() {
        // Hủy upload nếu cần
    }
}

// Plugin để gắn upload adapter
function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new MyUploadAdapter(loader);
    };
}

const Reports = () => {
    const [description, setDescription] = useState('');

    return (
        <div style={{ padding: 20 }}>
            <h2>CKEditor 5 với Upload Ảnh</h2>
            <CKEditor
                editor={ClassicEditor}
                data=''
                config={{
                    licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDg1NjMxOTksImp0aSI6IjAyNWQzYzhiLTg4NDEtNDNhYi05ZThhLTQ1ZWY4MjNmM2QxNyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImI4OGQ1MjM1In0.scN2OnfESxaUvv_KNfs8su4q_DVhJewuqQBgPxHaMP029xvh75WaXMoa4oGioaXkpxg2F_9-hlSsLmsFwKsA7A', // Or 'GPL'.
                    extraPlugins: [MyCustomUploadAdapterPlugin],
                    image: {
                        resizeOptions: [
                            { name: 'resizeImage:original', label: 'Original', value: null },
                            { name: 'resizeImage:50', label: '50%', value: '50' },
                            { name: 'resizeImage:75', label: '75%', value: '75' },
                        ],
                        toolbar: ['resizeImage', 'imageStyle:full', 'imageStyle:side'],
                    },
                }}
                onReady={editor => {
                    console.log('Editor is ready', editor);
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    console.log({ data });
                    setDescription(data);
                }}
            />
            <h2>Xem trước</h2>
            <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
    );
};

export default Reports;

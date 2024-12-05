import client from '../http-client';

interface Params {
	[key: string]: string | number | boolean | null; // Tipe umum untuk parameter URL
}

interface FolderResponse {
	meta: any;
	data: any;
}

interface FolderError {
	response: {
		status: number;
		data: {
			message: string;
		};
	};
}

// Callback sukses
type Callback = (response: FolderResponse) => void; // Menyusun tipe untuk callback sukses

// Callback error
type ErrorCallback = (error: FolderError) => void; // Menyusun tipe untuk callback error

const endpoint = 'folders';

export const getData = (
	params: Params,
	callback: Callback,
	errorCallback: ErrorCallback
): void => {
	client
		.get<FolderResponse>(endpoint, { params })
		.then((res) => {
			callback(res.data);
		})
		.catch((e) => {
			errorCallback(e);
		});
};

export const getDataSub = (id: number, params: any, callback: any, errorCallback: any) => {
    client.get(`${endpoint}/${id}/child`, { params })
    .then((res) => {
        callback(res.data);
    })
    .catch((e) => {
        errorCallback(e);
    });
};

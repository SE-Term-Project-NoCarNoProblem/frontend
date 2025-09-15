export function fetchWithAuth(url: string, options: RequestInit = {}) {
	const token = localStorage.getItem('token');
	const headers = {
		...options.headers,
		'Authorization': `${token}`,
		'Content-Type': 'application/json',
	};
	return fetch(url, { ...options, headers });
}
export function fetchWithAuthFile(url: string, file: File, fieldName: string) {
	const token = localStorage.getItem('token');
	const formData = new FormData();
	formData.append(fieldName, file);
	
	const headers = {
		'Authorization': `${token}`,
		// Don't set Content-Type header - let browser set it automatically with boundary
	};
	
	return fetch(url, {
		method: 'POST',
		headers,
		body: formData,
	});
}
resetPassword(email: string) {
  return this.http.post<any>(`${this.apiUrl}/reset-password`, { email });
} 
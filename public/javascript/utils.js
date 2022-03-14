function clearSearchData() {
    sessionStorage.removeItem('q');
    sessionStorage.removeItem('lat');
    sessionStorage.removeItem('lng');
    sessionStorage.removeItem('dist');
    sessionStorage.removeItem('type');
    sessionStorage.removeItem('age');
    sessionStorage.removeItem('equipment');
    sessionStorage.removeItem('features');
}
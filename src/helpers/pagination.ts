const Pagination = (page:string,size:string)=>{
    const pageOptions = {
        page: parseInt(page) || 0,
        size: parseInt(size) || 10,
      };
    const skip = pageOptions.page * pageOptions.size;
    
    return {pageOptions,skip}  
}

export default Pagination;
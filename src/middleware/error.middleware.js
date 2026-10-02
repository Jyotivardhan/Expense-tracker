export const notFound = (req, res, next) =>{
    res.status(404).json({error: `Route not found: ${req.method} ${req.originalUrl}`})
}

export const errorHandler = (err, req, res, next) =>{
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    if(status >= 500){
        console.error('Server error:', err)
    }
    res.status(status).json({error: message})
}
import img from './error.gif';

const ErrorMessage = () => {
    return (
        <img style={{ display: 'block', width: "250px", height: "250px",objectFit: 'contain', margin: "0 auto"}}  src={img} alt="Error"/>
    )
    // при добавлении гифки ошибки выяснилось, что нужно добавить стилей, но их можно и перенести в style
}

export default ErrorMessage;
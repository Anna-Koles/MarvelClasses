import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
    state = {
        char: {}, // данные придут из API
        loading: true,
        error: false
    }

    marvelService = new MarvelService(); // это свойство this.marvelService, синтаксис полей классов

    componentDidMount() {
        this.updateChar();
        this.timerId = setInterval(this.updateChar, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    onCharLoaded = (char) => { // когда персонаж загрузился, в char записывается новый объект
        this.setState({
            char, 
            loading: false
        })
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000); // большинство персонажей в данном API - в пределах этих id; floor - округление 
        this.onCharLoading(); // спиннер перед тем, как сделать запрос, на случай, если ответ будет приходить не сразу
        this.marvelService
            .getCharacter(id)  // метод по получению персонажа из компонента MarvelService
            .then(this.onCharLoaded) // результат подставляется аргументом char в onCharLoaded
            .catch(this.onError);
    }

    render() {

        const {char, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <View char={char}/> : null; // если loading или error false, то в компонент View передается char в пропсы

        return ( 
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button onClick={this.updateChar} className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = ({char}) => { // отображение динамической части (т.е. той половины слева, где может появиться спиннер), простой рендерящий компонент без логики
    const {name, description, thumbnail, homepage, wiki} = char;
    let imgStyle = {'objectFit' : 'cover'}; 
    // чтобы картинка, что персонаж без image, показывалась полностью, не обрезался текст
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyle}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;
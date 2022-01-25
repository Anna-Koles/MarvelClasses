import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest(); // вызывается, когда компонент создан; аргумента нет => отступ базовый 210
    }

    onRequest = (offset) => { // для вызова по клику есть аргумент, куда подставляется новый отступ 
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded) // каждый раз при новом offset получает массив с новыми персонажами (newCharList)
            .catch(this.onError)
    }

    onCharListLoading = () => { // персонажи загружаются
        this.setState({
            newItemLoading: true // на этапе первичной загрузки это true ни на что не влияет
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {  // если в массиве осталось меньше 9 элементов, то он заканчивается, а значит надо удалить кнопку со страницы
            ended = true;
        }

        this.setState(({offset, charList}) => ({  // callback, т.к. зависит от предыдущего state; charList вначале пустой из стейта
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    itemRefs = []; // класс активности задан с помощью рефов только в целях тренировки
    setRef = (elems) => {
        this.itemRefs.push(elems);
    }

    setFocus = (i) => {
        if (this.itemRefs) { 
            this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
            this.itemRefs[i].classList.add('char__item_selected');
            this.itemRefs[i].focus();
        }
    }
    
    renderItems(arr) {  // отдельно, чтобы не делать это в render
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    className="char__item"
                    key={item.id}  // id каждого персонажа из API
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.setFocus(i);
                    }}
                    ref={this.setRef}
                    tabIndex={0} 
                    onKeyPress={(e) => { // для доступа с клавиатуры
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
                        }
                    }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });
       
        return ( //  для центровки спиннера/ошибки
            <ul className="char__grid"> 
                {items}
            </ul>
        )
    }

    render() {

        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;
        
        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long"
                    disabled={newItemLoading} // сделать кнопку неактивной, если идет загрузка новых 9 персонажей; из newItemLoading приходит true или false
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => this.onRequest(offset)}>  {/* текущее состояние offset */}
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired // показать в консоли предупреждение, если onCharSelected не передан; он должен быть функцией
}

export default CharList;
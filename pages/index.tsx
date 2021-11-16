import Image from 'next/image';
import type { NextPage } from 'next';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import "@pathofdev/react-tag-input/build/index.css";
import ReactTagInput from "@pathofdev/react-tag-input";

import Modal from '../components/Modal';
import PlusImage from '../public/plus.svg';
import CheckImage from '../public/check.svg';
import CardBook from '../components/CardBook';
import SearchImage from '../public/search.svg';
import PlusPurpleImage from '../public/plus-purple.svg';

interface IBook {
  title: string;
  author: string;
  description: string;
  pages: number;
  tags: string[];
  _id: string;
}

const BASE_URL = 'http://localhost:5000/api/books';

const Home: NextPage = () => {
  const [pages, setPages] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [description, setDescription] = useState<string>('');


  const [books, setBooks] = useState<IBook[]>([]);
  const [filterByTag, setFilterByTag] = useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [searchInputValue, setSearchInputValue] = useState<string>('');

  const togglefilterByTag = () => {
    setFilterByTag(!filterByTag);
  };
  
  useEffect(() => {
    fetch(BASE_URL, {
      method: 'GET',
      redirect: 'follow'
    })
    .then(response => response.json())
    .then(result => setBooks(result))
    .catch(error => console.error('error', error));
  }, []);

  const filterBooks = () => {
    if (filterByTag) {
      fetch(`${BASE_URL}?tag=${searchInputValue}`, {
        method: 'GET',
        redirect: 'follow'
      })
      .then(response => {
        if (response.status === 204) {
          return [];
        }
        else {
          return response.json();
        }
      })
      .then(result => setBooks(result))
      .catch(error => console.error('error', error));
    }
    else {
      fetch(`${BASE_URL}?title=${searchInputValue}`, {
        method: 'GET',
        redirect: 'follow'
      })
      .then(response => {
        if (response.status === 204) {
          return [];
        }
        else {
          return response.json();
        }
      })
      .then(result => setBooks(result))
      .catch(error => console.error('error', error));
    }
  };

  const handleFormSubmit = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const formBody = JSON.stringify({
      title,
      author,
      description,
      pages: Number(pages),
      tags,
    });

    fetch(BASE_URL, {
      method: 'POST',
      headers: myHeaders,
      body: formBody,
      redirect: 'follow'
    })
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.log('error', error))
      .finally(() => {
        window.location.reload();
      });
  };

  return (
    <Container>
      <Header>
        <div className="header-top" >
          <p className="title" >MLPR</p>
          <p className="subtitle" >Melhores livros para relembrar</p>
        </div>
        <div className="header-bottom" >
          <span className="search-wrapper" >
            <div className="search-bar">
              <input 
                className="search-input" 
                placeholder="Buscar" 
                value={searchInputValue} 
                onChange={(event) => setSearchInputValue(event.target.value)}
              />
              <button className="search-button" onClick={filterBooks} >
                <Image src={SearchImage} alt="search image" />
              </button>
            </div>
            <div className="search-input-checkbox">
              <label htmlFor="toggle" >
                <div style={{ opacity: filterByTag ? 1 : 0 }} >
                  <Image height={13} width={20} src={CheckImage} alt="check image" />
                </div>
              </label>
              <input  onClick={togglefilterByTag} type="checkbox" id="toggle" className="visually-hidden" />
              <span>Procurar somente por tags</span>
            </div>
          </span>
          <div className="button-modal-wrapper" >
            <button onClick={() => setModalIsOpen(true)} >
              <span className="plus-image" >
                <Image height={18} width={18} src={PlusImage} alt="plus image" />
              </span>
              <span className="label" >Adicionar</span>
            </button>
            <Modal isOpen={modalIsOpen} >
              <ModalContentWrapper>
                <div className="modal-header" >
                  <Image height={18} width={18} src={PlusPurpleImage} alt="plus image" />
                  <span className="modal-header-label" >Adicionar novo livro</span>
                </div>
                <div className="modal-body" >
                  <form className="modal-body-form" >
                    <span className="label-input" >Titulo do livro</span>
                    <input 
                      type="text"
                      className="input-text"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                    />

                    <span className="label-input" >Autor</span>
                    <input
                      type="text"
                      className="input-text"
                      value={author}
                      onChange={(event) => setAuthor(event.target.value)}
                    />

                    <span className="label-input" >Descrição</span>
                    <textarea
                      className="input-text"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                    />

                    <span className="label-input" >Páginas</span>
                    <input
                     type="text"
                      className="input-text"
                      value={pages}
                      onChange={(event) => setPages(event.target.value)}
                    />

                    <span className="label-input" >Tags</span>
                    <ReactTagInput 
                      tags={tags}
                      onChange={(newTags) => setTags(newTags)}
                    />
                  </form>
                </div>
                <div className="modal-footer" >
                  <button onClick={() => setModalIsOpen(false)} >Cancelar</button>
                  <button className="modal-footer-adicionar" onClick={handleFormSubmit} >
                    <Image height={18} width={18} src={PlusImage} alt="plus image" />
                    <span>Adicionar</span>
                  </button>
                </div>
              </ModalContentWrapper>
            </Modal>
          </div>
        </div>
      </Header>
      <Main>
        {books.map((book, index) => <CardBook key={index} filteredTag={searchInputValue} book={book} />)}
      </Main>
    </Container>
  );
};

export default Home;

const Container = styled.div`
  width: 932px;
  margin: 0 auto;
  margin-top: 83px;
`;

const Header = styled.header`
  .search-wrapper {
    display: flex;
    align-items: center;
  }

  .search-wrapper .search-input {
    border: none;
    border-radius: 20px;
    width: 240px;

    font-size: 16px;
    padding-left: 10px;

    color: #9466FF;
    ::placeholder {
      color: #9466FF;
    }
  }

  .search-button {
    border: none;
    background: none;

    cursor: pointer;
    margin-right: 10px;
  }

  .search-bar {
    box-shadow: 0px 3px 6px #00000029;
    border-radius: 20px;
    padding: 20px;
  }

  .search-input-checkbox {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 28.5px;

    .visually-hidden {
      position: absolute;
      left: -100vw;
    }

    label {
      background: #FFFFFF;
      padding: 5px;

      border-radius: 10px;
      box-shadow: 0px 3px 6px #00000029;
    }

    label:hover {
      cursor: pointer;
    }

    span {
      margin-left: 15px;
      color: #A8A8B3;
    }
  }

  .title {
    font-size: 60px;
    color: #707070;
  }

  .subtitle {
    color: #A8A8B3;

    margin-top: 7px;
    
    font-size: 40px;
    font-weight: lighter;
  }

  .header-bottom {
    display: flex;
    justify-content: space-between;

    margin-top: 60px;
  }

  .button-modal-wrapper button {
    border: none;
    border-radius: 21px;

    box-shadow: 0px 3px 6px #00000029;
    background: #9466FF 0% 0% no-repeat padding-box;

    padding: 17px 0;

    display: flex;
    align-items: center;

    cursor: pointer;
  }

  .button-modal-wrapper span.label {
    color: #FFFFFF;
    font-size: 16px;
    font-family: Roboto;
    margin-right: 26px;
  }

  .plus-image {
    padding-left: 24px;
    margin-right: 8px;
  }
`;

const ModalContentWrapper = styled.div`
  background: #FEFEFE 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 20px;
  padding: 20px;

  .modal-header-label {
    color: #9466FF;
    font-size: 24px;
    font-weight: lighter;

    margin-left: 14px;
  }

  .modal-body-form {
    margin: 0 85px;
    margin-top: 43px;
    margin-bottom: 20px;
    width: 486px;

    display: flex; 
    flex-direction: column;
  }

  .modal-body-form textarea {
    resize: none;
    height: 135px;
  }

  .input-text {
    background: #FFFFFF 0% 0% no-repeat padding-box;
    border: 1px solid #9466FF;
    border-radius: 10px;
    padding: 10px;
  }

  .label-input {
    color: #707070;
    margin-top: 20px;
    margin-bottom: 4px;
    font-size: 24px;
  }

  .modal-footer {
    width: 486px;

    display: flex;
    justify-content: space-between;
    margin: 0 85px;
  }

  .modal-footer button {
    border: none;
    border-radius: 21px;

    box-shadow: 0px 3px 6px #00000029;
    background: #9466FF 0% 0% no-repeat padding-box;

    padding: 17px 40px;

    cursor: pointer;

    font-family: Roboto;
    color: #FFFFFF;
    font-size: 16px;
  }

  .modal-footer-adicionar {
    display: flex;
    align-items: center;
  }

  .modal-footer-adicionar span {
    margin-left: 8px;
  }

  // react-tag
  .react-tag-input {
    background: #FFFFFF 0% 0% no-repeat padding-box;
    border: 1px solid #9466FF;
    border-radius: 10px;
    padding: 10px;
  } 

  .react-tag-input__input::placeholder {
    color: #FFFFFF;
  }
`;

const Main = styled.main`
  margin-top: 41px;
`;
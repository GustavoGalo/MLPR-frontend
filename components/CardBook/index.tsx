import { useState } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';

type CardBookProps = {
  book: {
    title: string;
    author: string;
    description: string;
    pages: number;
    tags: string[];
    _id: string;
  },
  filteredTag?: string;
};

const BASE_URL = 'http://localhost:5000/api/books';

const CardBook = ({ book: {title, author, description, pages, tags, _id }, filteredTag }: CardBookProps) => {
  const tagElements: JSX.Element[] = [];
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  tags.forEach((tag) => {
    if (tag === filteredTag) {
      tagElements.push(<span className="tag bold" >{`#${tag}`}</span>);
    }
    else {
      tagElements.push(<span className="tag light" >{`#${tag}`}</span>);
    }
  });

  const removeBook = () => {
    fetch(`${BASE_URL}/${_id}`, {
      method: 'DELETE',
      redirect: 'follow'
    })
    .then(() => console.log(`${_id} removido`))
    .catch(error => console.error('error', error));
    setModalIsOpen(false);
    window.location.reload();
  };
  
  return (
    <Container>
      <div className="cardbook-header" >
        <div className="cardbook-header-top" >
          <p className="title" >{title}</p>
          <div className="button-modal-wrapper" >
            <button className="remove-button" onClick={() => setModalIsOpen(true)} >Remover</button>
            <Modal isOpen={modalIsOpen} >
              <ModalContentWrapper>
                <span className="label" >Deseja realmente remover o livro?</span>
                <span className="options" >
                  <button onClick={() => setModalIsOpen(false)} >Cancelar</button>
                  <button onClick={removeBook} >Sim, remover</button>
                </span>
              </ModalContentWrapper>
            </Modal>
          </div>
        </div>
        <div className="cardbook-header-bottom" >
          <span>{author}<span style={{ margin: '0 10px' }} >-</span>{pages}</span>
        </div>
      </div>
      <div className="cardbook-body" >
        {`"${description}"`}
      </div>
      <div className="cardbook-footer" >
        {tagElements}
      </div>
    </Container>
  );
}

export default CardBook;

const ModalContentWrapper = styled.div`
  background: #FFFFFF 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 20px;
  padding: 20px;

  display: flex;
  flex-direction: column;

  .label {
    font-size: 24px;
    margin: 55px 78px;
  }

  .options {
    margin: 0 auto;
  }

  .options button {
    background: #9466FF 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #00000029;
    border: none;
    color: #FFFFFF;
    border-radius: 15px;
    cursor: pointer;
  }

  .options button:nth-of-type(1) {
    margin-right: 19px;
    padding: 12px 27px;
  }
  .options button:nth-of-type(2) {
    margin-right: 19px;
    padding: 12px 11.5px;
  }
`;

const Container = styled.div`
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 20px;
  background: #FFFFFF 0% 0% no-repeat padding-box;
  padding: 20px;
  margin-bottom: 28px;

  .cardbook-header-top {
    display: flex;
    justify-content: space-between;
    
  }

  .cardbook-header-top .title {
    font-size: 24px;
    font-weight: bold;
  }

  .cardbook-header-top a {
    color: #9466FF;
    font-family: Roboto;
    font-size: 16px;
    font-weight: lighter;
  }

  .cardbook-header-bottom {
    font-size: 16px;
    color: #BFBFBF;
  }

  .cardbook-body {
    font-size: 24px;
    margin-top: 23px;
  }

  .cardbook-footer {
    margin-top: 23px;
  }

  .cardbook-footer .tag {
    font-size: 24px;
    color: #9466FF;
    margin-right: 16px;
  }

  .cardbook-footer .bold {
    font-weight: bold;
  }

  .cardbook-footer .light {
    font-weight: lighter;
  }

  .remove-button {
    color: #9466FF;
    font-family: Roboto;
    font-size: 16px;
    font-weight: lighter;

    border: none;
    background: none;
    text-decoration: underline;
    cursor: pointer;
  }
`;
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer, Info } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const [info, setInfo] = useState('');
  const history = useHistory();
  async function handleUpload(): Promise<void> {
    const data = new FormData();
    data.append('file', uploadedFiles[0].file);

    try {
      api.post('/transactions/import', data).then(result => {
        console.log(result);
        // setInfo('Importação feita com sucesso!');
        history.push('/');
      });
    } catch (err) {
      console.log(err.response.error);
      setInfo('Erro ao tentar Impotar arquivo');
    }
  }

  function submitFile(files: File[]): void {
    const fileArray = files.map(file => {
      return {
        file,
        name: file.name,
        readableSize: filesize(file.size),
      };
    });
    setUploadedFiles(fileArray);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <Info>
          <p>{info}</p>
        </Info>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;

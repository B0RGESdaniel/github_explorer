import { FormEvent, useState, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import { Title, Form, Repositories, Error } from './styles';


type Repository = {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;

    }
}

export function Dashboard() {
    const [newRepo, setNewRepo] = useState('');
    const [inputError, setInputError] = useState('');
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories');

        if(storagedRepositories){
            return JSON.parse(storagedRepositories);
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
    }, [repositories])

    async function handleAddRepository(event:FormEvent<HTMLFormElement>){
        event.preventDefault();

        if(!newRepo){
            setInputError('Digite o autor/nome do repositório')
            return;
        }

        try {
            const response = await api.get<Repository>(`repos/${newRepo}`)

            const repository = response.data;
    
            setRepositories([...repositories, repository]) // imutabilidade, tem que passar o array todo de novo
            setNewRepo('');
            setInputError('');
        } catch(error){
            setInputError('Erro na busca por esse repositório')
        }

    }

    return(
        <>
        <img src="https://xesque.rocketseat.dev/platform/1587379765556-attachment.svg" alt="Github Explorer" />
        <Title>Explore repositórios no Github</Title>

        <Form hasError={!!inputError} onSubmit={handleAddRepository}>
            <input
              value={newRepo}
              onChange={(e) => setNewRepo(e.target.value)}
              type="text"
              placeholder="Digite o nome do repositório" 
            />
            <button type="submit">Pesquisar</button>
        </Form>

        { inputError && <Error>{inputError}</Error>}

        <Repositories>
            { repositories.map(repository => (
                <Link to={`/repositories/${repository.full_name}`} key={repository.full_name}>
                    <img 
                     src={repository.owner.avatar_url} 
                     alt={repository.owner.login}
                    />
                    <div>
                        <strong>{repository.full_name}</strong>
                        <p>{repository.description}</p>
                    </div>
                    <FiChevronRight size={20}/>
                </Link>
            )) }
        </Repositories>
        </>
    )   
}
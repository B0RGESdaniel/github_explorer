import { useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

import api from '../../services/api';

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import { Header, RepositoryInfo, Issues } from './styles';

type RepositoryParams = {
    repository: string;
}

type RepositoryProps = {
    full_name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    owner: {
        login: string;
        avatar_url: string;

    }
}

type Issue = {
    id: number;
    title: string;
    html_url: string;
    user: {
        login: string;
    }
}

export function Repository() {
    const [repository, setRepository] = useState<RepositoryProps | null>(null);
    const [issues, setIssues] = useState<Issue[]>([]);

    const { params } = useRouteMatch<RepositoryParams>();

    useEffect(() => {
        api.get(`repos/${params.repository}`).then((response) => setRepository(response.data)) 

        api.get(`repos/${params.repository}/issues`).then((response) => setIssues(response.data)) 

    }, [params.repository])

    return(
        <>
        <Header>
            <img src="https://xesque.rocketseat.dev/platform/1587379765556-attachment.svg" alt="Github Explorer" />
            <Link to="/">
                <FiChevronLeft size={16}/>
                Voltar
            </Link>
        </Header>
        { repository && (
            <RepositoryInfo>
                <header>
                    <img src={repository.owner.avatar_url} alt={repository.owner.login} />
                    <div>
                        <strong>{repository.full_name}</strong>
                        <p>{repository.description}</p>
                    </div>
                </header>
                <ul>
                    <li>
                        <strong>{repository.stargazers_count}</strong>
                        <span>Stars</span>
                    </li>
                    <li>
                        <strong>{repository.forks_count}</strong>
                        <span>Forks</span>
                    </li>
                    <li>
                        <strong>{repository.open_issues_count}</strong>
                        <span>Issues abertas</span>
                    </li>
                </ul>
            </RepositoryInfo>
        ) }
        <Issues>
            { issues.map((issue) => {
                <a key={issue.id} href={issue.html_url}>
                    <div>
                        <strong>{issue.title}</strong>
                        <p>{issue.user.login}</p>
                    </div>
                    <FiChevronRight size={20}/>
                </a>
            }) }
        </Issues>
        </>
    )   
}
import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./componente.css";

const DEFAULT_QUERY = "redux";
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = "100";

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

const isSearched = (searchTerm) => (item) => !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

const Search = ({ value, onChange, children, onSubmit }) => 
	<form onSubmit={onSubmit}>
		<input value={value} 
			type="text"
			onChange={onChange}
		/>
		<button type="submit">
			{children}
		</button>
	</form>

const Button = ({ onClick, className = "", children }) =>
	<button onClick={onClick} className={className} type="button">
		{children}
	</button>
		

const Table = ({ list, onDismiss }) => 
	<div className="table">
		{list.map(item => 
			<div key={item.objectID} className="table-row">
				<span style={{ width: "40%" }}>
					<a href={item.url}>{item.title}</a>
				</span>
				<span style={{width: '30%'}}>{item.author}</span>
				<span style={{ width: '10%' }}>{item.num_comments}</span>
				<span style={{ width: '10%'}}>{item.points}</span>
				<span style={{ width: '10%' }}>
					<Button className="button-inline" onClick={() => onDismiss(item.objectID)} type="button">
							Dismiss
					</Button>
				</span>
			</div>
		)}
	</div>

class Componente extends Component {
	constructor(props) {
		super(props);
		this.state = {
				result: null,
				searchTerm: DEFAULT_QUERY,
		};
		this.onDismiss = this.onDismiss.bind(this);
		this.onSearchChange = this.onSearchChange.bind(this);
		this.setSearchTopStories = this.setSearchTopStories.bind(this);
		this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
		this.onSearchSubmit = this.onSearchSubmit.bind(this);
}

	onSearchSubmit(event) {
		const { searchTerm } = this.state;
		this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
		event.preventDefault();
	}

	setSearchTopStories(result) {
		const { hits, page } = result;
		const oldHits = page !== 0 ? this.state.result.hits : [];
		const updatedHits = [...oldHits, ...hits];
		this.setState({ result: { hits: updatedHits, page } });
	};
	fetchSearchTopStories(searchTerm, page) {
		fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
			.then(response => response.json())
			.then(result => this.setSearchTopStories(result))
			.catch(error => error);
	};
	componentDidMount() {
		const { searchTerm } = this.state;
		this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
	};

	onSearchChange(event) {
		this.setState({ searchTerm: event.target.value });
	}
	onDismiss(id) {
		const isNotId = item => item.objectID !== id;
		const updatedHits = this.state.result.hits.filter(isNotId);
		this.setState({ 
			result: { ...this.state.result, hits: updatedHits }
		 });
	};
    
  render() {
    const { searchTerm, result } = this.state;
	const page = (result && result.page) || 0;
    return (
			<div className="page">
				<div className="interactions">
				<Search 
					value={searchTerm} 
					onChange={this.onSearchChange}
					onSubmit={this.onSearchSubmit}
				>
					Search
				</Search>
				</div>
				{
					result 
					&&
					<Table 
						list={result.hits}
						onDismiss={this.onDismiss}
					></Table>
  				}
				<div className="interactions">
					<Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
						More
					</Button>	
				</div>		
			</div>
    );
  }
}

export default Componente;
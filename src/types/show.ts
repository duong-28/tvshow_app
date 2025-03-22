// represents a show 
export interface Show {
    id: number;          
    name: string;        
    summary: string;     
    image?: {           
      medium: string;    
      original: string; 
    };
    rating: {
      average: number | null;  
    };
    genres: string[];    
    status: string;      
    premiered: string; 
    ended: string | null;
  }
  
  // represents a search result for a show
  export interface ShowSearchResult {
    score: number;  
    show: Show;     
  }
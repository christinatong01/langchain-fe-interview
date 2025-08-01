# Core + Bonus Features

## Trace Tree
- Lazy loading implemented to improve performance by only loading children when nodes are expanded
- Search functionality allows users to filter nodes by name
- Visual hierarchy shows parent-child relationships with expand/collapse functionality
- Status indicators with color-coded status (success, error, running)
- Performance metrics display duration, tokens, and cost for each run

## Run Details Panel
- Input display shows one input type at a time (messages, query, or raw JSON)
- Output display shows all available output types (messages, documents, generations)
- Error handling shows execution errors and API fetching errors
- Run information displays ID, type, status, duration, tokens, and cost
- Renderers with separate components for different data types (MessagesRenderer, DocumentsRenderer, etc.)

# Considerations

## Performance 
- Lazy loading only processes and renders nodes that have been expanded
- Memoization uses useMemo for filtering and tree building
- Search based on search index

## Code Organization
- Separated renderers so each data type has its own component
- Type safety with proper TypeScript interfaces for all data structures
- Decided not to separate out the TraceTree component, since state was tightly coupled, and the component was not too long

## User Experience
- Clear visual hierarchy for easy understanding of parent-child relationships
- Error states provide clear feedback when things go wrong
- Loading states show indicators during data fetching

# Future Improvements

## Performance
- Server side search/pagination to prevent downloading all trace data at once
- Cache loaded nodes or frequently accessed ones

## Trace Viewer
- Add additional search options for status, run type, id, and status
- Collapse all, expand all functionality

# Challenges
- Lazy load and search: lazy loading only processes nodes that were expanded, but the search filtering was only happening on the processed nodes, so search couldn't find nodes that hadn't been loaded yet. The first solution was when searching, build the complete tree then filter it, and when not searching, still use lazy loading. I assessed that this could be slow, so I implemented an index-based search, so we only process the relevant nodes (matches and their ancestors) to build a minimal tree.
- First time using Tailwind CSS, but I like it

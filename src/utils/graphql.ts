export function parseNodes<T extends { node: any }>(nodes: T[]): T['node'][] {
	return nodes.map(({ node }) => ({
		...node,
	}));
}

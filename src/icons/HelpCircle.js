export default function HelpCircle({ width, height }) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={width ? width : 24} height={height ? height : 24} viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
	)
}
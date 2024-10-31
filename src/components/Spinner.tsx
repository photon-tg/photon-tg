import { CSSProperties, useEffect } from 'react';

const Spinner = () => {
	const loaderStyle: CSSProperties = {
		border: '4px solid #e5e7eb', // Tailwind's gray-200
		borderTop: '4px solid #3b82f6', // Tailwind's blue-500
		borderRadius: '50%',
		width: '64px', // Tailwind's w-16
		height: '64px', // Tailwind's h-16
		animation: 'spin 1s linear infinite',
	};

	const spinAnimation = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

	// Create a style element to hold the keyframes
	useEffect(() => {
		const style = document.createElement('style');
		style.innerHTML = spinAnimation;
		document.head.appendChild(style);
		return () => {
			document.head.removeChild(style);
		};
	}, []);

	return (
		<div className="flex items-center justify-center">
			<div style={loaderStyle}></div>
		</div>
	);
};

export default Spinner;

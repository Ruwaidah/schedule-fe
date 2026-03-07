export default function IconEye({ open, ...props }) {
    return open ? (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <path
                d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7S2.5 12 2.5 12Z"
                className="stroke-current"
                strokeWidth="1.5"
            />
            <path
                d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z"
                className="stroke-current"
                strokeWidth="1.5"
            />
        </svg>
    ) : (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <path
                d="M3 4l18 16"
                className="stroke-current"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M10.8 5.2A9.5 9.5 0 0 1 12 5c6 0 9.5 7 9.5 7a18.3 18.3 0 0 1-3.3 4.1"
                className="stroke-current"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M6.1 7.3C3.8 9.3 2.5 12 2.5 12S6 19 12 19c1.7 0 3.2-.3 4.5-.9"
                className="stroke-current"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M10.2 10.2A3.5 3.5 0 0 0 15 15"
                className="stroke-current"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}
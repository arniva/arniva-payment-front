import type * as bootstrap from 'bootstrap';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	const bootstrap: typeof import('bootstrap');
	type BootstrapDropdown = bootstrap.Dropdown;
	type Modal = bootstrap.Modal;
	type Tooltip = bootstrap.Tooltip;
	type Popover = bootstrap.Popover;
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

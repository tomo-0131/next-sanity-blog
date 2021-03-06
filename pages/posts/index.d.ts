export default PortableText;
export function blockContentToPlainText(blocks?: [any]): string;
/**
 * Renders an array of Portable Text blocks as React components.
 *
 * @param {object} props
 * @param {[object]} props.content Array of portable text blocks
 * @param {string} props.className Optional className
 * @param {object} props.serializers Optional serialization overrides
 * @param {string} props.dataset
 * @param {string} props.projectId
 * @returns
 */
declare function PortableText({
	content,
	className,
	serializers,
	...additionalOptions
}: {
	content: [object];
	className: string;
	serializers: object;
	dataset: string;
	projectId: string;
}): any;
declare namespace PortableText {
	namespace propTypes {
		const content: any;
		const className: any;
		const serializers: any;
		const dataset: any;
		const projectId: any;
	}
}

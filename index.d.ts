export function blockContentToPlainText(blocks?: [any]): string;
/**
 * @param {object} props
 * @param {[object]} props.config
 * @param {string} props.className
 * @param {object} props.selializers
 * @param {string} props.dataset
 * @param {string} props.projectId
 * @returns
 */

declare function PortableText({
	content,
	className,
	serializers,
	dataset,
	projectId,
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
		const dataset: string;
		const projectId: string;
	}
}

export default PortableText;

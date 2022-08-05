export default function routePeformerType(
	performerType: 'SOLO' | 'GROUP' | 'SCHOOL'
) {
	let routeName = ''
	switch (performerType) {
		case 'SOLO':
			routeName = 'SoloContactInfo'
			break
		case 'GROUP':
			routeName = 'GroupContactInfo'
			break
		case 'SCHOOL':
			routeName = 'School'
			break
	}
	return routeName
}

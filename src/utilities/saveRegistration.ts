import { useAppStore } from '@/stores/appStore'
import { useClasses } from '@/stores/userClasses'
import { useCommunity } from '@/stores/userCommunity'
import { useGroup } from '@/stores/userGroup'
import { usePerformers } from '@/stores/userPerformer'
import { useRegistration } from '@/stores/userRegistration'
import { useSchool } from '@/stores/userSchool'
import { useTeacher } from '@/stores/userTeacher'

const registrationStore = useRegistration()
const performerStore = usePerformers()
const groupStore = useGroup()
const communityStore = useCommunity()
const classesStore = useClasses()
const appStore = useAppStore()
const schoolStore = useSchool()
const teacherStore = useTeacher()

export default function saveRegistration() {
	let registrationID = registrationStore.registrationId
	registrationStore.saveRegistration()
	switch (appStore.performerType) {
		case 'SOLO':
			performerStore.savePerformers(registrationID)
			break
		case 'GROUP':
			groupStore.saveGroups(registrationID)
			performerStore.savePerformers(registrationID)
			break
		case 'SCHOOL':
			schoolStore.saveSchool(registrationID)
			break
		case 'COMMUNITY':
			communityStore.saveCommunityGroups(registrationID)
	}
	teacherStore.saveTeacher(registrationID)
	classesStore.saveClasses(registrationID)
}

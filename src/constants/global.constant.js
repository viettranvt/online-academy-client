import SchoolIcon from '@material-ui/icons/School';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PeopleIcon from '@material-ui/icons/People';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CategoryIcon from '@material-ui/icons/Category';
import HomeIcon from '@material-ui/icons/Home';
import { userRole } from './user-role.constant';
import {
  RegistrationCourses as RegistrationCoursesView,
  FavoriteCourses as FavoriteCoursesView,
  InChargeCourses as InChargeCoursesView,
  Categories as CategoriesView,
  Courses as CoursesView,
  Users as UsersView,
} from 'views';

export const APP_NAME = 'Hero Academy';
export const APP_SLOGAN = 'Cung cấp khóa học online chất lượng cao';
export const APP_LOGO_IMAGE = 'https://cdn.iconscout.com/icon/free/png-256/graduation-cap-1519981-1287612.png';
export const STATUS = {
  COURSE: {
    FINISHED: 'Khóa học đã được giảng viên cập nhật đầy đủ nội dung.',
    UNFINISHED: 'Khóa học chưa được giảng viên cập nhật đầy đủ nội dung.'
  }
}

export const availablePages = {
  HOME: {
    _id: 1,
    title: '',
    path: '/',
    auth: false,
    icon: HomeIcon,
    role: userRole.GUEST.value
  },
  SIGN_UP: {
    _id: 2,
    title: 'Đăng ký tài khoản học viên',
    path: '/sign-up',

    auth: false,
    role: userRole.GUEST.value
  },
  SIGN_IN: {
    _id: 3,
    title: 'Đăng nhập tài khoản',
    path: '/sign-in',
    auth: false,
    role: userRole.GUEST.value
  },
  NOT_FOUND: {
    _id: 4,
    title: 'Not Found',
    path: '/not-found',
    auth: false,
    role: userRole.GUEST.value
  },
  COURSE_DETAILS: {
    _id: 2,
    title: '',
    path: '/courses/:courseId',
    auth: false,
    role: userRole.GUEST.value
  },
  CATEGORY_COURSES: {
    _id: 5,
    title: '',
    path: '/categories/:categoryId/courses',
    auth: false,
    role: userRole.GUEST.value
  },
  COURSE_SEARCHING: {
    _id: 6,
    title: '',
    path: '/search',
    auth: false,
    role: userRole.GUEST.value
  },
  REGISTRATION_COURSES: {
    _id: 7,
    title: 'Khóa học đăng ký',
    path: '/registrations',
    auth: true,
    role: userRole.STUDENT.value,
    icon: SchoolIcon,
    type: 'FIRST_BY_ROLE',
    component: RegistrationCoursesView
  },
  FAVORITE_COURSES: {
    _id: 8,
    title: 'Khóa học yêu thích',
    path: '/favorites',
    auth: true,
    role: userRole.STUDENT.value,
    icon: FavoriteIcon,
    component: FavoriteCoursesView
  },
  IN_CHARGE_COURSES: {
    _id: 9,
    title: 'Khóa học phụ trách',
    path: '/uploaded',
    auth: true,
    role: userRole.LECTURER.value,
    icon: SchoolIcon,
    type: 'FIRST_BY_ROLE',
    component: InChargeCoursesView
  },
  CATEGORIES: {
    _id: 10,
    title: 'Lĩnh vực',
    path: '/categories',
    auth: true,
    role: userRole.ADMIN.value,
    icon: CategoryIcon,
    type: 'FIRST_BY_ROLE',
    component: CategoriesView
  },
  COURSES: {
    _id: 11,
    title: 'Khóa học',
    path: '/courses',
    auth: true,
    role: userRole.ADMIN.value,
    icon: SchoolIcon,
    component: CoursesView
  },
  USERS: {
    _id: 12,
    title: 'Thành viên',
    path: '/members',
    auth: true,
    role: userRole.ADMIN.value,
    icon: PeopleIcon,
    component: UsersView
  },
  PROFILE: {
    _id: 99,
    title: 'Tài khoản',
    path: '/account',
    auth: true,
    role: userRole.GUEST.value,
    icon: AccountCircleIcon
  }
};
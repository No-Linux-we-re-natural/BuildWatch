import { verify } from "./api.mjs";

if (!localStorage.getItem('token')) location.href = '../settings';
else {
    verify().then((e) => {
        if (!e) location.href = '../settings';
    })
}
import { Input, Button, Upload, message, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './uploader.css';
import { SetStateAction, useEffect, useState } from 'react';
// for web3 storage
// import { Web3Storage } from 'web3.storage';
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';
import { UploadFile } from 'antd/lib/upload/interface';

// 浏览文件以及上传按钮组合组件
function InputFile(props: any) {
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [uploading, setUploading] = useState<boolean>(false);

	const uploadProps = {
		onRemove: (file: UploadFile<any>): boolean => {
			setFileList(list => {
				const index = list.indexOf(file);
				const newFileList = list.slice();
				newFileList.splice(index, 1);
				return newFileList;
			});
			return true;
		},
		beforeUpload: (file: UploadFile): boolean => {
			setFileList(() => {
				// return [...list, file];
				return [file]; //最多一个
			});
			props.changeCid('');
			props.changePercent(0);
			return false; //手动上传
		},
		fileList,
	};

	const handleUpload = async () => {
		setUploading(true);

		const client = new Web3Storage({
			token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQ0RTFDMzZkREM5NjI2MjY1ZWM5OWJhNkUwYzZmZDE0Y0I3MjA2NkUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2MzU1NzM4NzIyNTYsIm5hbWUiOiJ1cGxvYWRlciJ9.qJ4Q_9IaazEYoy9qey5dCVCGw7O315kbbODobUnBW1I',
		});

		const onRootCidReady = (cid: any) => {
			console.log('uploading files with cid:', cid);
			//修改cid
			props.changeCid(cid);
		};

		const totalSize = fileList
			.map(f => f.size)
			.reduce((a, b) => (a === undefined ? 0 : a) + (b === undefined ? 0 : b), 0);
		let uploaded = 0;

		const onStoredChunk = (size: number) => {
			uploaded += size;
			const pct = (uploaded / (totalSize as number)) * 100;
			console.log(`Uploading... ${pct.toFixed(2)}% complete`);
			// 修改进度条
			if (uploaded >= (totalSize as number)) {
				setUploading(false);
				message.success('上传文件成功!');
			}
			props.changePercent(pct);
		};

		return client.put(fileList, {
			name: fileList[0].name,
			wrapWithDirectory: false,
			maxRetries: 3,
			onRootCidReady,
			onStoredChunk,
		});
	};

	return (
		<div className="inputFile1">
			<div className="input1" style={{ width: '65%' }}>
				<Input
					addonBefore="http://"
					placeholder="上传的文件地址"
					allowClear
					size="large"
					// value={filename.current}
				/>
			</div>
			<div className="upload1" style={{ width: '85px' }}>
				<Upload {...uploadProps} maxCount={1}>
					<Button size="large">Browse</Button>
				</Upload>
			</div>
			<div className="button1" style={{ width: '120px' }}>
				<Button
					icon={<UploadOutlined />}
					type="primary"
					onClick={handleUpload}
					disabled={fileList.length === 0}
					loading={uploading}
					size="large"
					style={{ width: '120px' }}
				>
					{uploading ? 'Uploading' : 'Upload'}
				</Button>
			</div>
		</div>
	);
}

// 上传后文显示组件
function TextTip(props: any) {
	const [cid, setCid] = useState('');
	const [url1, setUrl1] = useState('');
	const [url2, setUrl2] = useState('');

	useEffect(() => {
		setUrl1(cid === '' ? '' : 'https://ipfs.io/ipfs/' + cid);
		setUrl2(cid === '' ? '' : 'https://dweb.link/ipns/ipnso.com/?cid=' + cid);
	}, [cid]);

	useEffect(() => {
		setCid(props.cid);
	}, [props.cid]);

	return (
		<div id="textTip-id">
			<p>
				File uploaded to:
				<br />
				{cid}
			</p>
			<p>
				You Can access the file using public gateways now:
				<br />
				<a href={'https://ipfs.io/ipfs/' + cid} target="_blank" rel="noreferrer" white-space="nowrap">
					{url1}
				</a>
				<br />
				<a
					href={'https://dweb.link/ipns/ipnso.com/?cid=' + cid}
					target="_blank"
					rel="noreferrer"
					white-space="nowrap"
				>
					{url2}
				</a>
			</p>
		</div>
	);
}

// uploader总组件
// 标题
// 按钮
// 文字显示
function Uploader() {
	const [cid, setCid] = useState('');
	const [percent, setPercent] = useState(0);

	return (
		<div className="uploader-div">
			<div className="title">
				<h1>IPFS File Uploader</h1>
			</div>
			<div className="inputFile-div">
				<InputFile
					changeCid={(cid: SetStateAction<string>) => {
						setCid(cid);
					}}
					changePercent={(percent: SetStateAction<number>) => {
						setPercent(percent);
					}}
				/>
			</div>
			<div className="progress">
				<Progress percent={percent} status="normal" showInfo={true} style={{ width: '46%', left: '-1%' }} />
			</div>
			<div className="textTip-div">
				<TextTip cid={cid} />
			</div>
		</div>
	);
}

export default Uploader;
